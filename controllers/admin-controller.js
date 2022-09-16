const { Restaurant } = require('../models')

exports.getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.findAll({ raw: true })
    return res.render('admin/restaurants', { restaurants })
  } catch (err) {
    next(err)
  }
}

exports.createRestaurant = (req, res, next) => {
  return res.render('admin/create-restaurants')
}

exports.postRestaurant = async (req, res, next) => {
  try {
    const {name, tel, address, openingHours, description} = req.body
    if (!name) throw new Error('Restaurant name required')

    await Restaurant.create({ 
      name,
      tel,
      address,
      openingHours,
      description
    })

    req.flash('success_messages','restaurant successfully created')
    res.redirect('/admin/restaurants')
  } catch (err) {
    next(err)
  }
}