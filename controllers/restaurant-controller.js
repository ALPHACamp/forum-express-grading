const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''

    // const where = {}
    // if (categoryId) where.categoryId = categoryId

    return Promise.all([
      Restaurant.findAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        },
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
      // map 整理出來的新陣列，需要多設一個變數 data 來接住回傳值，最後我們要使用的資料會放在 data
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50) // 把敘述截斷為50個字，截取字串可用 substring()
        }))
        return res.render('restaurants', {
          restaurants: data, // 要使用的資料會放在 data
          categories,
          categoryId
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      {
        // raw: true,
        nest: true,
        include: Category
      })
      .then(restaurant => {
        if (!restaurant) throw new Error('這間餐廳不存在!')
        restaurant.increment('viewCounts')
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      {
        raw: true,
        nest: true,
        include: Category
      })
      .then(restaurant => {
        if (!restaurant) throw new Error('這間餐廳不存在!')
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
