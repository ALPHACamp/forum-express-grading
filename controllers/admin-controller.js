const { Restaurant } = require('../models')
const { AdminError } = require('../errors/errors')
const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true
      })
      return res.render('admin/restaurants', { restaurants }) // admin前面不要加forward slash
    } catch (error) {
      return next(error)
    }
  },
  createRestaurants: (req, res, next) => {
    try {
      res.render('admin/create-restaurants')
    } catch (error) {
      return next(error)
    }
  },
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description } = req.body
      if (!name) { throw new AdminError('Restaurant name is required!') }
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description
      })
      req.flash('success_messages', 'restaurant was successfully created') // 在畫面顯示成功提示
      return res.redirect('/admin/restaurants')
    } catch (error) {
      return next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10)
      const restaurant = await Restaurant.findByPk(id, {
        raw: true // 去掉query的原始值
      })
      if (!restaurant) {
        throw new AdminError('Restaurant didn\'t exist!')
      }
      return res.render('admin/restaurant', { restaurant })
    } catch (error) {
      return next(error)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10)
      const restaurant = await Restaurant.findByPk(id, {
        raw: true // 去掉query的原始值
      })
      if (!restaurant) {
        throw new AdminError('Restaurant didn\'t exist!')
      }
      return res.render('admin/restaurant', { restaurant })
    } catch (error) {
      return next(error)
    }
  },
  putRestaurant: async (req, res, next) => {

  }

}

module.exports = { adminController }
