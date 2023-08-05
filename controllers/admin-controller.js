const { Restaurant, User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const restaurantController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => console.log(err))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Restaurant name is required!') // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示

    const { file } = req

    imgurFileHandler(file).then(filePath => {
      return Restaurant.create({ // 產生一個新的 Restaurant 物件實例，並存入資料庫
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      })
    })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants') // 新增完成後導回後台首頁
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.rest_id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error('restaurant not found')
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => console.log(err))
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.rest_id, { raw: true })
      .then(restaurant => res.render('admin/edit-restaurant', { restaurant }))
      .catch(err => console.log(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req

    Promise.all([
      Restaurant.findByPk(req.params.rest_id),
      imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.rest_id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to delete')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  getUsers: (req, res) => {
    User.findAll({ raw: true })
      .then(users => res.render('admin/users', { users }))
      .catch(err => console.log(err))
  }
}
module.exports = restaurantController
