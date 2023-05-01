"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'crud',
    password: '123456789',
    port: 5432,
});
pool.connect().then(function () {
    console.log("Database connected");
}).catch(function (error) {
    console.log("Error connecting to database:", error.message);
});
exports.default = pool;
