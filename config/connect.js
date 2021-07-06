var mysql = require('mysql')
require('dotenv').config()

const connect = mysql.createConnection ({
    host : process.env.host_db,
    user : process.env.user_db,
    port : process.env.port,
    password : process.env.password,
    database : process.env.database
})

connect.connect((err) => {
    if (err){
        console.log('database connect fail', err)
    }
    else {
        console.log('database has connected')
    }
})

module.exports = connect