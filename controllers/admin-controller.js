const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

//
const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        res.render('admin/restaurants', { restaurants })
      })
      .catch(err => next(err))
  },
  createRestaurant: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    imgurFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        categoryId,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      }))
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        console.log(restaurant)
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    Promise.all([
      Restaurant.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          categoryId,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true
    })
      .then(users => {
        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id)
      .then(user => {
        if (!user) {
          throw new Error('使用者不存在')
        } else if (user.email === 'root@example.com') {
          require('../middleware/error-handler').generalErrorHandler('禁止變更 root 權限', req, res, next)
          // throw '禁止變更 root 權限'
          // next(new Error('禁止變更 root 權限'))
          // next('禁止變更 root 權限')
        } else {
          req.flash('success_messages', '使用者權限變更成功')
          return user.update({
            isAdmin: !user.isAdmin
          }).then(() => res.redirect('/admin/users'))
        }
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
