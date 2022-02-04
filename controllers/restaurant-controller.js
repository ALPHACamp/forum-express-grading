const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      const data =
      restaurants.map(r => ({
        ...r, description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', { restaurants: data})
    })
  },
  /*使用者可以依分類篩選餐廳
  使用者可以切換分頁，一次瀏覽 10 筆餐廳*/
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: Category
    }).then(restaurant => {
      if (!restaurant) throw new Error('Restaurant did not exist!')
      res.render('restaurant', { restaurant })
    })
      .catch(err => next(err))
  }

  /*使用者可以新增評論
    使用者可以瀏覽該餐廳的所有評論
    管理員可以刪除餐廳*/
}
module.exports = restaurantController
