import {Pool } from "pg"

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'crud',
    password: '123456789',
    port: 5432,
  });
  pool.connect().then(() => {
    console.log("Database connected");
  }).catch((error) => {
    console.log("Error connecting to database:", error.message);
  });

  export default pool;