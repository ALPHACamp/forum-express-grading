const assert = require('assert')
const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { isSuperUser } = require('../helpers/users-helper')
const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        res.render('admin/restaurants', { restaurants })
      })
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return Category.findAll({ raw: true }).then(categories =>
      res.render('admin/create-restaurant', { categories })
    )
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } =
      req.body
    assert(name, new Error('Restaurant name is required!'))
    const { file } = req
    return imgurFileHandler(file)
      .then(filePath =>
        Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null,
          categoryId
        })
      )
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        assert(restaurant, new Error("Restaurant didn't exist!"))
        return res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        assert(restaurant, new Error("Restaurant didn't exist!"))
        return res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },

  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } =
      req.body
    assert(name, new Error('Restaurant name is required!'))
    const { file } = req
    return Promise.all([
      Restaurant.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        assert(restaurant, new Error("Restaurant didn't exist!"))
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          categoryId
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        return res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        assert(restaurant, new Error("Restaurant didn't exist!"))
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then(users => {
        assert(users.length, new Error('No user is found!'))
        return res.render('admin/users', { users })
      })
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        assert(user, new Error('User does not exist!'))
        // root
        if (isSuperUser(user)) {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        // user -> admin or admin -> user
        return user.update({ isAdmin: !user.isAdmin }) // use NOT GATE to inverse choise
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        return res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
