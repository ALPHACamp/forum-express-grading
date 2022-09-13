
const { Restaurant } = require('../models')

const adminController = {
  getRestaurant: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true })
      return res.render('admin/restaurants', { restaurants })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = adminController
