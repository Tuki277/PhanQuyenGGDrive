const data = require('../config/connect')
const jwt = require('jsonwebtoken')

exports.createAccount = (req, res, next) => {
    const { username, password, role } = req.body
    data.query('INSERT INTO account (username, password, role) values (?, ?, ?)', [username, password, role], (err, rows, fields) => {
        if ( err ) {
            res.status(503).json({ message: "Server error", err })
        } else {
            res.status(201).json({ message: "Created"})
        }
    })
}

exports.login = (req, res, next) => {
    const { username, password } = req.body
    data.query('SELECT * FROM account WHERE username = ? and password = ?', [username, password], (err, rows, fields) => {
        if (rows.length > 0) {
            const id = rows[0].id
            const token = jwt.sign({ id }, 'token')
            if ( err ) {
                res.status(503).json({ message: "Server error", err })
            } else {
                res.status(200).json({ message: "Login success",
                                       token
                                     })
            }
        } else {
            res.status(200).json({ message: "Login fail" })
        }
    })
}

exports.updateAccountByAdmin = (req, res, next) => {
    const { username, password, role } = req.body
    const id = req.params.id
    console.log(req.token)
    // jwt.verify(req.token, 'token', (err, authData) => {
        // if ( err ) {
            // res.status(403).json({ message: "Fail token" })
        // } else {
            data.query('UPDATE account SET username = ?, password = ?, role = ? WHERE id = ?', [username, password, role, id], (err, rows, fields) => {
                if ( err ) {
                    res.status(503).json({ message: "Server error", err })
                } else {
                    res.status(200).json({ message: "Updated" })
                }
            })
        // }
    // })
}


exports.deleteAccount = (req, res, next) => {
    const id = req.params.id
    data.query('DELETE FROM account WHERE id = ?', id, (err, rows, fields) => {
        if ( err ) {
            res.status(503).json({ message: "Server error", err })
        } else {
            res.status(200).json({ message: "Deleted" })
        }
    })
}

exports.addContent = (req, res, next) => {
    const { content, id_user, id_can_view } = req.body
    data.query('INSERT INTO content (content, id_user, id_can_view) VALUES (?, ?, ?)', [content, id_user, id_can_view], (err, rows, fields) => {
        if ( err ) {
            res.status(503).json({ message: "Server error", err })
        } else {
            res.status(201).json({ message: "created" })
        }
    })
}

exports.updateContent = (req, res, next) => {
    const { content, id_user, id_can_view } = req.body
    const id = req.params.id
    data.query('UPDATE content SET content = ?, id_user = ?, id_can_view = ? WHERE id_content = ?', [content, id_user, id_can_view, id], (err, rows, fields) => {
        if ( err ) {
            res.status(503).json({ message: "Server error", err })
        } else {
            res.status(200).json({ message: "Updated"})
        }
    })
}

exports.updateUserCanView = (req, res, next) => {
    const id = req.params.id
    const id_can_view = req.body.id_can_view
    data.query('SELECT id_can_view FROM content WHERE id_content = ?', id, (err, rows, fields) => {
        if ( err ) {
            res.status(503).json({ message: "Server error", err })
        } else {
            var arr = (rows[0].id_can_view).split(', ')
            arr.push(id_can_view.toString())
            var changeUserView = arr.toString()
            console.log({ changeUserView })
            data.query('UPDATE content SET id_can_view = ? WHERE id_content = ?', [changeUserView, id], (err, rows, fields) => {
                if ( err ) {
                    // res.status(503).json({ message: "Server error", err })
                    console.log(err)
                } else {
                    res.status(200).json({ message: "Updated id_can_view" })
                    next()
                }
            })
        }
    })
}

exports.deleteContent = (req, res, next) => {
    const id = req.params.id
    data.query('DELETE FROM content WHERE id_content = ?', id, (err, rows, fields) => {
        if ( err ) {
            res.status(503).json({ message: "Server error", err })
        } else {
            res.status(200).json({ message: "Deleted" })
        }
    })
}

exports.viewAllContent = (req, res, next) => {
    // const key = jwt.verify(req.data, 'token')
    data.query('SELECT * FROM content', (err, rows, fields) => {
        if ( err ) {
            res.status(503).json({ message: "Server error", err })
        } else {
            res.status(200).json({ data: rows })
        }
    })
}

exports.viewContent = (req, res, next) => {
    console.log('token ======= ', req.token)
    jwt.verify(req.token, 'token', (err, authData) => {
        if ( err ) {
            res.status(403).json({ message: "Fail token" , err})
        } else {
            const id = req.params.id
            data.query('SELECT * FROM content WHERE id_content = ?', id, (err, rows, fields) => {
                if ( err ) {
                    res.status(503).json({ message: "Server error", err })
                } else {
                    res.status(200).json({ data: rows })
                }
            })
        }
    })
}