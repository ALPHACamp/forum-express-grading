const { Restaurant, User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { response } = require('express')

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
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name required')
    const { file } = req
    const filePath = await imgurFileHandler(file)
    await Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description,
      image: filePath || null
    })

    req.flash('success_messages', 'restaurant successfully created')
    res.redirect('/admin/restaurants')
  } catch (err) {
    next(err)
  }
}

exports.getRestaurant = async (req, res, next) => {
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
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Name is required')
    const { file } = req
    const [restaurant, filePath] = await Promise.all(
      [
        Restaurant.findByPk(req.params.restaurantId),
        imgurFileHandler(file)
      ])
    if (!restaurant) throw new Error('Restaurant not found')
    await restaurant.update({
      name,
      tel,
      address,
      openingHours,
      description,
      image: filePath || restaurant.image
    })
    req.flash('success_messages', 'Successfully updated')
    res.redirect('/admin/restaurants')
  } catch (err) {
    next(err)
  }
}

exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (!restaurant) throw new Error('No restaurant found')
    await restaurant.destroy()
    req.flash('success_messages', 'Successfully deleted')
  } catch (err) {
    next(err)
  }
}

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ raw: true })
    return res.render('admin/users', { users })
  } catch (err) {
    next(err)
  }
}

exports.patchUser = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await User.findByPk(userId)
    if (!user) throw new Error('No user found')
    if (user.email === 'root@example.com') {
      req.flash('error_messages','禁止變更 root 權限')
      return res.redirect('back')
    }
    await user.update({
      isAdmin: !user.isAdmin
    })
    req.flash('success_messages', '使用者權限變更成功')
    return res.redirect('/admin/users')
  } catch (err) {
    next(err)
  }
}
