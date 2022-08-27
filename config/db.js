const mysql = require("mysql2/promise");

const mydb = mysql.createPool({
  connectionLimit: 5, //important
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  debug: false,
});

mydb.getConnection()
  .then((conn) => {
    console.log("Successfully connected to the database.");
    conn.release();
  })
  .catch((e) => {
    console.log(e);
});


module.exports = mydb;
