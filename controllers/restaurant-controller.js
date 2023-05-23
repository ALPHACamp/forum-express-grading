const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { // 去資料庫用 id 找一筆資料
      include: [Category]
    })
      .then(restaurant => { // 此時撈出的資料仍是sequelize的原生格式
        if (!restaurant) throw new Error("Restaurant didn't exist!") // 如果找不到，回傳錯誤訊息，後面不執行
        res.render('restaurant', { restaurant: restaurant.toJSON() }) // 所以也可以用toJSON()去解析，但只有找單筆資料時可以用此方法
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
