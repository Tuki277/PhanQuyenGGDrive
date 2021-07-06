const data = require('./../config/connect')
const jwt = require('jsonwebtoken')

exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    if ( typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken
        next()
    } else {
        res.status(403).json({ message: 'Fail token'})
    }
}

exports.authAdmin = (req, res, next) => {
    const token = req.headers['authorization']
    const tokenData = token.slice(7)
    req.data = tokenData
    const key = jwt.verify(req.data, 'token')
    // console.log(key)
    data.query('SELECT * FROM account WHERE id = ?', [key.id], (err, rows, fields) => {
        if ( err ) {
            res.status(503).json({ message: "Server error", err})
        } else {
            if (rows[0].Role === "admin") {
                next()
            } else {
                res.status(401).json({ message: "Not permission"})
            }
        }
    })
}

exports.checkUserCanView = (req, res, next) => {
    // console.log(req.token)
    const id = req.params.id
    const token = req.headers['authorization']
    const tokenData = token.slice(7)
    req.data = tokenData
    console.log(req.data)
    const key = jwt.verify(req.data, 'token')
    console.log(key)
    data.query('SELECT id_can_view FROM content WHERE id_content = ?', id, (err, rows, fields) => {
        if ( err ) {
            res.status(503).json({ message: "Server error", err })
            console.log(err)
        } else {
            console.log(rows[0].id_can_view)
            let arr = JSON.parse("[" + (rows[0].id_can_view) + "]");
            // var arr = a.split(', ')
            console.log(arr)
            console.log(arr.length)
            if (arr.indexOf(key.id) === - 1) {
                res.status(403).json({ message: "Not permission" })
            } else {
                next()
            }
        }
    })
}