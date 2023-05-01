import express, {Request,Response, NextFunction } from 'express';
import Joi from "joi"
import pool from "./conn";
import jwt from "jsonwebtoken"
import"./users"
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

var  app = express();
const port = 2222;
const secret = "secret-key";
app.use(express.json())
app.use(express.urlencoded({ extended: false }));



// define joi userSchema

const userSchema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    email:Joi.string().email().required(),
    password: Joi.string().min(8).max(50).required(),

}).options({abortEarly:false})

// add authentication 

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secret, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};





// get all users
app.get("/users",authenticateToken, async (_req:Request, res:Response)  => {
    try {
      const result = await pool.query('SELECT * FROM users');
      res.send(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
//   add user
  app.post("/users",async(req:Request, res:Response) =>{
    try {
        // validate user
        const { error, value } = userSchema.validate(req.body);
        if (error) {
          return res.status(400).send(error.details[0].message);
        }
    
        const { name, email, password } = value;

    
        await pool.query(
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
          [name, email, password]
        );
         const token = jwt.sign({ email: email }, secret);
    res.status(201).send({ token: token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
// update 
app.put("/users/:id", async(req:Request, res:Response)  => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    try {
      const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
      if (result.rows.length > 0) {
        res.send(result.rows[0]);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
//   delete user
app.delete("/users/:id", async (req:Request, res:Response) => {
    const id = parseInt(req.params.id);
    try {
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length > 0) {
        res.send(result.rows[0]);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  


app.listen(port,()=>{
    console.log("server run on port 2222");
    
})




