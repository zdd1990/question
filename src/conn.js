const mysql = require('mysql');
const conn = mysql.createConnection({
    host: '127.0.0.1',
    // port:'3306',
    user: 'root',
    password: '',
    database: 'shop'
});
conn.connect();//链接数据库
module.exports = conn;