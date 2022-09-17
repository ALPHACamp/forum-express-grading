const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
    signUpPage: (req, res) => {
        res.render('signup')
    },
    signUp: (req, res) => {
        console.log('有進到這個路由嗎')
        bcrypt.hash(req.body.password, 10)
            .then(hash => User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash
            }))
            .then(() => {
                res.redirect('/signin')
            })
    }
}
module.exports = userController