const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getUsers: (req, res) => {User.findAll({raw: true})
    .then(users => {res.render('admin/users', {users: users })})
    .catch(err => res.status(422).json(err))
  },

  toggleAdmin: (req, res) => {
    User.findByPk(req.params.id)
    .then(user => {
      user.isAdmin = !user.isAdmin
      return user.save()
    })
    .then(user =>{ 
      if(user.isAdmin){req.flash('success_messages', `恭喜${user.name}成為管理員~!😋😋`)
      }else{req.flash('success_messages', `${user.name}得罪了方丈還想跑，推下神壇！`)}
      return res.redirect('/admin/users')}
    )
    .catch(err => res.status(422).json(err))
  },
  
  getRestaurants: (req, res) => {
    Restaurant.findAll({raw: true, nest: true, include: [Category]})
    .then(restaurants => { res.render('admin/restaurants', {restaurants}) })
    .catch(err => res.status(422).json(err))
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {raw:true, nest:true, include: [Category]})
    .then(restaurant => { 
      console.log('res:', restaurant)
      return res.render('restaurant', {restaurant:restaurant}) 
    })
    .catch(err => res.status(422).json(err))
  },

  createRestaurant: (req, res) => {
    Category.findAll({raw:true, nest:true})
    .then(categories => res.render('admin/create', {categories}))
    .catch(err => res.status(422).json(err))    
  },

  editRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {raw:true, include: [Category]})
    .then(restaurant => { 
      Category.findAll({raw:true, nest:true})
      .then(category => res.render('admin/create', {restaurant, category}))
      .catch(err => res.status(422).json(err)) 
    })
  },
//send created restaurant

  postRestaurant: (req, res) => {
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
          if (err) console.log('Error: ', err)
            return Restaurant.create({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : null,
              CategoryId: Number(req.body.categoryId)
            })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully created')
              return res.redirect('/admin/restaurants')
            })
            .catch(err => res.status(422).json(err))
        })
      } else {
        return Restaurant.create({         
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: null,
          CategoryId: Number(req.body.categoryId)
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
        .catch(err => res.status(422).json(err))
      }
  },

  //send edit restaurant
  putRestaurant: (req, res) => {
    const { file } = req 
    if(!req.body.name){
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error: ', err)
          return Restaurant.findByPk(req.params.id, {include: [Category]})
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: Number(req.body.categoryId)
            })                        
          })          
          .then(() => {
            req.flash('success_messages', '餐廳已成功更新(含檔案)！')
            return res.redirect('/admin/restaurants')
          })
      })
    } else {
      Restaurant.findByPk(req.params.id, {include: [Category]})
        .then((restaurant) => {
          restaurant.name = req.body.name
          restaurant.tel = req.body.tel
          restaurant.address = req.body.address
          restaurant.opening_hours = req.body.opening_hours
          restaurant.description = req.body.description
          restaurant.CategoryId = Number(req.body.categoryId)
          return restaurant.save() 
        })
      .then(() => {
        req.flash('success_messages', '餐廳已成功更新！')
        return res.redirect('/admin/restaurants')
      })
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  }
}

module.exports = adminController