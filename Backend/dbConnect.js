const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    // host:"localhost",
    // database: 'test',
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 3306,                     
    connectTimeout: 10000  
});


module.exports= connection;