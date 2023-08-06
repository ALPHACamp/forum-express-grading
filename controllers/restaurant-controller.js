
const { Restaurant, Category } = require('../models')

const restaurantController = {
  // (頁面) 瀏覽所有餐廳-首頁
  getRestaurants: (req, res, next) => {
    // 空字串轉數字是0，是falsy，得到categoryId=''
    const categoryId = Number(req.query.categoryId) || ''

    return Promise.all([Restaurant.findAll({
      where: categoryId ? { categoryId } : {},
      include: Category,
      nest: true,
      raw: true
    }), Category.findAll({ raw: true })])
      .then(([restaurants, categories]) => {
        // 把餐廳敘述截至50個字，避免過長時版面亂掉
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data, categories, categoryId })
      })
      .catch(err => next(err))
  },
  // (頁面) 瀏覽單一餐廳資料
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      { nest: true, include: Category })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment({ viewCounts: 1 })
          .then(() => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      })
      .catch(err => next(err))
  },
  // (頁面) 顯示單一餐廳的Dashboard
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      { raw: true, nest: true, include: Category })
      .then(restaurant => res.render('dashboard', { restaurant }))
      .catch(err => next(err))
  }
}

module.exports = restaurantController
