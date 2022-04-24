const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || '' // 從網址上拿下來的參數是字串，先轉成 Number 再操作
    return Promise.all([Restaurant.findAll({
      include: Category,
      where: { // 新增查詢條件
        ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
      },
      nest: true,
      raw: true
    }), Category.findAll({ raw: true })])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50) // 用 substring 把餐廳敘述 (description) 截為 50 個字
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('viewCounts')
        res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
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
        console.log(restaurant.viewCounts, restaurant)
        res.render('dashboard', {
          restaurant, viewCounts: restaurant.viewCounts
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
