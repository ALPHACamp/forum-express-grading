const {
  Restaurant
} = require('../models')

const adminController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ raw: true })
  }
}
module.exports = adminController
