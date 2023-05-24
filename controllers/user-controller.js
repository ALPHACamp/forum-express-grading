const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
    signUpPage: (req, res) => {
        res.render('signup')
    },
    signUp: (req, res, next) => {
        if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) throw new Error('Email alreday exists!')
                return bcrypt.hash(req.body.password, 10)
            })
            .then(hash => User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash
            }))
            .then(() => {
                req.flash('success_messages', '成功註冊帳號！')
                res.redirect('/signin')
            })
            .catch(err => next(err))
    },
    signInPage: (req, res) => {
        res.render('signin')
    },
    signIn: (req, res) => {
        req.flash('success_messages', '成功登入！')
        res.redirect('/restaurants')
    },
    logout: (req, res, next) => {
        req.logout(function (error) {
            if (error) {
                return next(error)
            }
            req.flash('success_messages', '登出成功！')
            res.redirect('/signin')
        })
    },
    getUser: (req, res, next) => {
        const id = req.params.id
        return User.findByPk(id, { raw: true })
            .then(user => {
                if (!user) throw new Error("User didn't exist!")
                return res.render('users/profile', { user })
            })
            .catch(err => next(err))
        // res.render('users/profile')
    },
    editUser: (req, res, next) => {
        return User.findByPk(req.params.id, { raw: true })
            .then(user => {
                if (!user) throw new Error("User didn't exist!")
                res.render('users/edit', { user })
            })
            .catch(err => next(err))
    },
    putUser: (req, res, next) => {
        const id = req.params.id
        const userId = req.user?.id || id
        const { name } = req.body
        if (!name) throw new Error('User name is required!')
        const { file } = req
        return Promise.all([
            User.findByPk(userId),
            imgurFileHandler(file)
        ])
            .then(([user, filePath]) => {
                if (!user) throw new Error("User didn't exist!")
                return user.update({
                    name, image: filePath || user.image
                })
            })
            .then(() => {
                req.flash('success_messages', '使用者資料編輯成功')
                res.redirect(`/users/${userId}`)
            })
    }
}
module.exports = userController
