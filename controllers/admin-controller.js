const { Restaurant, User, Category } = require('../models')
const helpers = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(error => next(error))
  },
  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then(users => {
        users.forEach(user => {
          user.permissionOptionValue = !user.isAdmin
        })
        res.render('admin/users', { users })
      })
      .catch(error => next(error))
  },
  patchUser: (req, res, next) => {
    const id = req.params.id
    return User.findByPk(id)
      .then(user => {
        if (!user) throw new Error('User didn\'t exist!')

        if (user.email === process.env.SUPERUSER_EMAIL) {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        return user.update({
          isAdmin: !user.isAdmin
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        return res.redirect('/admin/users')
      })
      .catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    Restaurant.findByPk(id, { raw: true, include: [Category] })
      .then(restaurant => {
        // avoid user from inputing id in url
        if (!restaurant) throw new Error('Restaurant didn\'t exist!')
        res.render('admin/restaurant', { restaurant })
      })
      .catch(error => next(error))
  },
  createRestaurant: (req, res, next) => {
    Category.findAll({ raw: true })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(error => next(error))
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    helpers.imgurFileHandler(file)
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
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  },
  editRestaurant: (req, res, next) => {
    const id = req.params.id
    Promise.all([
      Restaurant.findByPk(id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error('Restaurant didn\'t exist')
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
  },
  putRestaurant: (req, res, next) => {
    const id = req.params.id
    const { name, tel, address, openingHours, description, categoryId } = req.body
    const { file } = req
    Promise.all([
      Restaurant.findByPk(id),
      helpers.imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) =>
        restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          categoryId
        })
      )
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  },
  deleteRestaurant: (req, res, next) => {
    const { id } = req.params

    return Restaurant.destroy({
      where: { id }
    })
      .then(result => {
        if (!result) throw new Error('Restaurant didn\'t exist')
        req.flash('success_messages', '你已成功刪除餐廳')
        return res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  }

}

exports = module.exports = adminController
