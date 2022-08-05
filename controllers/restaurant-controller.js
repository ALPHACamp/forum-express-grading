const { Restaurant } = require('../models') // 新增這裡

const adminController = { // 修改這裡

  getRestaurants: (req, res, next) => {
    Restaurant.findAll({

      raw: true

    })

      .then(restaurants => res.render('restaurants', { restaurants }))

      .catch(err => next(err))
  }

}

module.exports = adminController
