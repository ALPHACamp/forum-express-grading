const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true // 把Sequelize包裝過的物件轉換成JS原生物件
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(e => next(e))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    // 若name是空值就會終止程式碼，並在畫面顯示錯誤提示
    if (!name) throw new Error('Restaurant name is required!')
    // create a new Restaurant instance and save it into db
    Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description
    }).then(() => {
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    }).catch(e => next(e))
  }
}

module.exports = adminController
