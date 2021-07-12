const bcrypt = require('bcryptjs') 
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const fs = require('fs')
const imgur = require('imgur-node-api')
const { urlencoded } = require('express')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Favorite = db.Favorite
const Followship = db.Followship
const Like = db.Like
//for test only
const helpers = require('../_helpers.js')
const getTestUser = function(req){
if (process.env.NODE_ENV === 'test'){
  return helpers.getUser(req)
}else{ return req.user }
}


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
    getTestUser(req)
    let isOwner = false
    const owner = req.user
    User.findByPk(req.params.id, { 
      include:{ 
        model:Comment, 
        include:{ 
          model: Restaurant
        }}})  
      .then((user) => { 
        if (user.id == owner.id || owner.isAdmin) isOwner = true
        res.render('user', { user: user.toJSON(), isOwner } )})                                                  
      .catch(err => res.status(422).json(err))
    },
  editUser: (req, res) => {
    getTestUser(req)
    const owner = req.user
    if(!owner.isAdmin && !(owner.id==req.params.id)){
      req.flash('warning_messages', "只有管理員有權限執行此操作。請登入管理員。")
      return res.redirect(`/users/${req.params.id}`)
    }
    User.findByPk(req.params.id, { raw:true, nest:true })  
    .then((user) => { res.render('userEdit', { user })})
  },
  putUser: (req, res) => {
    const { file } = req 
    const { name, email, description } = req.body
    if(!name){
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
              name: name,
              email: email,
              description: description,
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
        user.name=name
        user.email=email
        user.description=description
        user.save()
      })
      .then((user) => {
        req.flash('success_messages', '個人資料已成功更新！')
        return res.redirect(`/users/${req.params.id}`)
      })
    }
  },
  addFavorite: (req, res) => {
    const user = getTestUser(req)
    return Favorite.create({
      UserId: user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => { return res.redirect('back') })
  },
  removeFavorite: (req, res) => {
    const user = getTestUser(req)
    return Favorite.findOne({
      where: {
        UserId: user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },
  addLike: (req, res) => {
    const user = getTestUser(req)
    return Like.create({
      UserId: user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => { return res.redirect('back') })
  },
  removeLike: (req, res) => {
    const user = getTestUser(req)
    return Like.findOne({
      where: {
        UserId: user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topuser', { users: users })
    })
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
     .then((followship) => {
       return res.redirect('back')
     })
   },
   
   removeFollowing: (req, res) => {
    return Followship.findOne({where: {
      followerId: req.user.id,
      followingId: req.params.userId
    }})
      .then((followship) => {
        followship.destroy()
         .then((followship) => {
           return res.redirect('back')
         })
      })
   }
}

module.exports = userController