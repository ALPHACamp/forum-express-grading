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

exports.getRestaurant = async (req, res, next) =>{
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, { raw: true })
    if (!restaurant) {
      throw new Error('Restaurant not found')
    }
    return res.render('admin/restaurant', { restaurant })
  } catch (error) {
    next(error) 
  }
}

exports.editRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, { raw: true })
    if (!restaurant) throw new Error('No restaurant found')
    res.render('admin/edit-restaurant', { restaurant })
  } catch (err) {
    next(err)
  }
}

exports.putRestaurant = async (req, res, next) => {
  try {
    const { name, tel, address, openingHours, description} = req.body
    if (!name) throw new Error('Name is required')

    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (!restaurant) throw new Error('Restaurant not found')
    await restaurant.update({
      name,
      tel,
      address,
      openingHours,
      description
    })
    req.flash('success_messages','Successfully updated')
    res.redirect('/admin/restaurants')
  } catch(err) {
    next(err)
  }
}
