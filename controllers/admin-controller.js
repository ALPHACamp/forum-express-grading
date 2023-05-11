const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true // 把Sequelize包裝過的物件轉換成JS原生物件
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(e => next(e))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    // 若name是空值就會終止程式碼，並在畫面顯示錯誤提示
    if (!name) throw new Error('Restaurant name is required!')
    // create a new Restaurant instance and save it into db
    Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description
    }).then(() => {
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    }).catch(e => next(e))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant does not exist.')
        res.render('admin/restaurant', { restaurant })
      }).catch(e => next(e))
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        // 先檢查餐廳是否存在, 不存在則拋出錯誤訊息
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 存在的話顯示edit page
        res.render('admin/edit-restaurant', { restaurant })
      }).catch(e => next(e))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    // 此處不加raw, 才可以使用sequelize instance物件的update function
    Restaurant.findByPk(req.params.id)
      .then(restaurant => { // restaurant是sequelize instance物件
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 加上return減少巢狀的層數
        // 也可以使用Restaurant.update 但要加上 id
        return restaurant.update({ name, tel, address, openingHours, description })
      }).then(() => {
        req.flash('success_messages', 'restaurant was successfully updated')
        res.redirect('/admin/restaurants')
      })
      .catch(e => next(e))
  },
  deleteRestaurant:(req,res,next)=>{
    Restaurant.findByPk(req.params.id)
      .then(restaurant => { 
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      }).then(() => {
        req.flash('success_messages', 'restaurant was successfully deleted')
        res.redirect('/admin/restaurants')
      })
      .catch(e => next(e))
  }
}

module.exports = adminController
