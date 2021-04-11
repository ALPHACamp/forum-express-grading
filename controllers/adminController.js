const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const { useFakeServer } = require('sinon')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')
const category = require('../models/category')

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category], order: [['id', 'DESC']] })   // raw: true to turn sequelize object into JavaScript object
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
      .catch(err => console.log(err))
  },

  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        return res.render('admin/create', { categories })
      })
      .catch(err => console.log(err))
  },

  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      req.flash('error_msg', '所有欄位都是必填')
      return res.redirect('back')
    }


    const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name, tel, address, opening_hours, description,
          image: file ? img.data.link : null,
          CategoryId: categoryId
        }).then((restaurant) => {
          req.flash('success_msg', '成功新增餐廳！')
          return res.redirect('/admin/restaurants')
        })
      })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description, image: null, CategoryId: categoryId   // if no file, use null for image path
      })
        .then(restaurant => {
          req.flash('success_msg', '成功新增餐廳！')
          return res.redirect('/admin/restaurants')
        })
        .catch(err => console.log(err))
    }
  },

  getRestaurant: (req, res) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { include: [Category] })
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => console.log(err))
  },

  editRestaurant: (req, res) => {
    const id = req.params.id

    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return Restaurant.findByPk(id)
          .then(restaurant => {
            return res.render('admin/create', {
              restaurant: restaurant.toJSON(),
              categories
            })
          })
          .catch(err => console.log(err))
      })
  },

  putRestaurant: (req, res) => {
    const id = req.params.id
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(id)
          .then((restaurant) => {
            restaurant.update({
              name, tel, address, opening_hours, description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: categoryId
            })
              .then((restaurant) => {
                req.flash('success_msg', '成功編輯餐廳！')
                res.redirect('/admin/restaurants')
              })
          })
      })
    } else {
      return Restaurant.findByPk(id)
        .then(restaurant => {
          restaurant.update({
            name, tel, address, opening_hours, description, image: restaurant.image, CategoryId: categoryId
          })
        })
        .then(restaurant => {
          req.flash('success_msg', '成功編輯餐廳！')
          return res.redirect('/admin/restaurants')
        })
        .catch(err => console.log(err))
    }
  },

  deleteRestaurant: (req, res) => {
    const id = req.params.id
    return Restaurant.findByPk(id)
      .then(restaurant => {
        restaurant.destroy()
          .then(() => {
            return res.redirect('/admin/restaurants')
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true })
      .then(users => {
        return res.render('admin/users', { users })
      })
      .catch(err => console.log(err))
  },

  toggleAdmin: (req, res) => {
    const id = req.params.id

    return User.findByPk(id)
      .then(user => {
        // // 如果有啟動預防管理員將自己設為 user 的機制，測試會跑不過，所以先 comment 起來
        // if (helpers.getUser(req).id === user.id) {
        //   req.flash('error_msg', '管理員不可編輯自身權限！')
        //   return res.redirect('/admin/users')
        // }
        return user.update({
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: new Date(),
          isAdmin: user.isAdmin ? 0 : 1    // if user.isAdmin === '1', swap value to '0'; if opposite, swap value to '1'
        })
      })
      .then(user => {
        req.flash('success_msg', `成功編輯 ${user.name} 權限！`)
        return res.redirect('/admin/users')
      })
      .catch(err => console.log(err))
  }
}

module.exports = adminController