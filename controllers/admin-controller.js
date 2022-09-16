const { Restaurant } = require('../models')

exports.getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.findAll({ raw: true })
    return res.render('admin/restaurants', { restaurants })
  } catch (err) {
    next(err)
  }
}
