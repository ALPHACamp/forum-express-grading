const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  patchUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (user.email !== 'root@example.com') {
        await user.update({
          isAdmin: !user.isAdmin
        })
        req.flash('success_messages', '使用者權限變更成功')
        return res.redirect('/admin/users')
      } else {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
    } catch (error) {
      throw new Error('patchUser error')
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        raw: true
      })
      return res.render('admin/users', { users })
    } catch (error) {
      throw new Error('getUsers error')
    }
  },
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.rest_id, { // find a restaurant by primary key
      raw: true, // transform to plain object
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") // didnot find a restaurant
        else res.render('admin/restaurant', { restaurant }) // find a restaurant successfully
      })
      .catch(err => next(err))
  },
  createRestaurant: (req, res, next) => { // go to create restaurant page
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },
  postRestaurant: (req, res, next) => { // post of create restaurant page
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req // = const file = req.file
    imgurFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      })
      )
      .then(() => {
        req.flash('success_messages', 'restaurant was created successfully')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => { // go to edit restaurant page
    return Promise.all([
      Restaurant.findByPk(req.params.rest_id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!") // didn't find a restaurant
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => { // put of edit restaurant page
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req // = const file = req.file
    Promise.all([ // 非同步處理
      Restaurant.findByPk(req.params.rest_id), // 去資料庫查有沒有這間餐廳
      imgurFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          categoryId
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was updated successfully')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.rest_id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        else return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  }
}
module.exports = adminController
