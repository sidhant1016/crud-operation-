import pool from "./conn";
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
  )
`).then(() => {
  console.log('Users table created');
}).catch((error) => {
  console.error('Error creating users table:', error);
});

  export default pool
  
  
  
  
  