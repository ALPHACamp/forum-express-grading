const { Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then((restaurants) => {
        return res.render('admin/restaurants', { restaurants })
      })
      .catch((error) => next(error))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body

    // make sure restaurant name is not null
    if (!name) throw new Error('Restaurant name is required field!')

    // take out image file
    const { file } = req
    // pass image file to middleware: file-helpers
    // create this restaurant
    imgurFileHandler(file).then((filePath) =>
      Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
      })
        .then(() => {
          req.flash('success_messages', 'You have created restaurant successfully!')
          res.redirect('/admin/restaurants')
        })
        .catch((error) => next(error))
    )
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then((restaurant) => {
        if (!restaurant) throw new Error(`This restaurant doesn't exist!`)

        res.render('admin/restaurant', { restaurant })
      })
      .catch((error) => next(error))
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then((restaurant) => {
        if (!restaurant) throw new Error(`This restaurant doesn't exist!`)

        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch((error) => next(error))
  },
  putRestaurant: (req, res, next) => {
    // 1. take out data from req.body
    const { name, tel, address, openingHours, description } = req.body

    // 2. make sure restaurant name is not null
    if (!name) throw new Error('Restaurant name is required field!')

    // 3. deal with two Promise at the same time
    // 3-1. find by primary key: id
    // `restaurant` is insatnce of Restaurant
    // not necessary to change data into plain object, don't add { raw: true }
    // 3-2. take out image file from req, and pass to middleware: localFileHandler
    // get filePath
    // 4. update data getting from req.body and localFileHandler
    const { file } = req
    Promise.all([Restaurant.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error(`This restaurant doesn't exist!`)
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
        })
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant was updated successfully!')
        res.redirect('/admin/restaurants')
      })
      .catch((error) => next(error))
  },
  deleteRestaurant: (req, res, next) => {
    // 1. find by primary key: id
    // not necessary to change data into plain object, don't add { raw: true }
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        if (!restaurant) throw new Error(`This restaurant doesn't exist!`)
        // 2. if this restaurant exists, destroy it
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch((error) => next(error))
  },
}

module.exports = adminController
