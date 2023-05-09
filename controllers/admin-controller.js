const { Restaurant } = require('../models/')

const adminController = {
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    Restaurant.findByPk(id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Can not find this restaurant!')
        res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  },

  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => {
        res.render('admin/restaurants', { restaurants })
      })
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },

  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    // 驗證：沒有填名字
    if (!name) throw new Error('Name can not be empty!')

    // 建立餐廳 Record
    Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description
    })
      .then(() => {
        req.flash('success_messages', `${name} was successfully created!`)
        res.redirect('admin/restaurants')
      })
      .catch(err => next(err))
  },

  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Can not find restaurant to edit!')
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },

  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    // 驗證：沒有填名字
    if (!name) throw new Error('Name can not be empty!')

    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error('Can not find restaurant to edit!')

        // 修改餐廳 update
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description
        })
      })
      .then(() => {
        req.flash('success_messages', `${name} successfully updated!`)
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
