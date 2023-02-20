// 後台專用
const { sequelize } = require('../models')
const { QueryTypes } = require('sequelize')
// const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    sequelize.query('SELECT id, name FROM restaurants', { type: QueryTypes.SELECT })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  }
}
module.exports = adminController
