const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    // return Restaurant.findAll({
    //   include: Category,
    //   nest: true,
    //   raw: true
    // }).then(restaurants => {
    //   const data = restaurants.map(r => ({
    //     ...r,
    //     description: r.description.substring(0, 50)
    //   }))
    //   return res.render('restaurants', { restaurants: data })
    // })
    //   .catch(err => console.log(err))
    res.render('restaurants')
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category model
      nest: true // raw: true要拿掉不然取不到資料
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('viewCounts')
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
