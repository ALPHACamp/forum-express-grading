const bcrypt = require('bcryptjs') 
const db = require('../models')
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
const { urlencoded } = require('express')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers.js')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const {name, email, password, passwordCheck} = req.body
    const returnUser = {name, email}
    const errorArr = []
    if(!name || !email || !password){errorArr.push('所有的空格都要填寫。')}
    if(passwordCheck !== password){errorArr.push('確認密碼與密碼不一樣。')}
    if(name.length>10){errorArr.push('名字必須小於十個字元。')}
    if(password.length>10){errorArr.push('密碼必須小於十個字元。')}
    if(email.length>127){errorArr.push('Email太長了。')}
    User.findOne({where:{email}}).then(user => {
      if(user){errorArr.push('Email已經存在！請登入。')}
      if(errorArr.length){return res.render('signup', { returnUser, errorArr })}
      return User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)})
        .then(user => {
        req.flash('success_messages', '成功註冊帳號！請重新登入')
        return res.redirect('signin')})
        .catch(err => res.status(422).json(err))

    })},

  signInPage: (req, res) => {
    return res.render('signin')
  },
 
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('restaurants')
  },
 
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('signin')
  },
  getUser: (req, res) => {
    let isOwner = false
    const owner = helpers.getUser(req)
    User.findByPk(req.params.id, { raw:true, nest:true })  
      .then((user) => { 
        if (user.id == owner.id || owner.isAdmin) isOwner = true
        res.render('user', { user, isOwner } )})                                                  
      .catch(err => res.status(422).json(err))
    },
  editUser: (req, res) => {
    const owner = helpers.getUser(req)
    if(!owner.isAdmin && !(owner.id==req.params.id)){
      req.flash('warning_messages', "只有管理員有權限執行此操作。請登入管理員。")
      return res.redirect(`/users/${req.params.id}`)
    }
    User.findByPk(req.params.id, { raw:true, nest:true })  
    .then((user) => { res.render('userEdit', { user })})
  },
  putUser: (req, res) => {
    const { file } = req 
    if(!req.body.name){
      req.flash('warning_messages', "name doesn't exist")
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.error('Error: ', err)
          return User.findByPk(req.params.id)          
          .then((user) => {
            user.update({
              name: req.body.name,
              email: req.body.email,
              description: req.body.description,
              image: file ? img.data.link : user.image
            })                        
          })          
          .then(() => {
            req.flash('success_messages', '個人資料已成功更新(含檔案)！')
            return res.redirect(`/users/${req.params.id}`)
          })
      })
    } else {
      User.findByPk(req.params.id)
      .then((user) => {
        user.update({
          name: req.body.name,
          email: req.body.email,
          description: req.body.description
        }) 
      })
      .then(() => {
        req.flash('success_messages', '個人資料已成功更新！')
        return res.redirect(`/users/${req.params.id}`)
      })
    }
  },
}

module.exports = userController