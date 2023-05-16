const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      // 從網址上拿下來的參數是字串，先轉成 Number 再操作
      const categoryId = Number(req.query.categoryId) || ''
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAll({
          include: Category,
          where: { // 查詢條件
            ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
          },
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])

      const data = restaurants.map(r => {
        r.description = r.description.substring(0, 50)
        return r
      })

      // const data2 = restaurants.map(r => ({
      //   ...r,
      //   description: r.description.substring(0, 50)
      // }))

      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId
      })
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const incrementResult = await restaurant.increment('viewCounts')

      res.render('restaurant', { restaurant: incrementResult.toJSON() })
    } catch (err) { next(err) }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        raw: true,
        nest: true
      })

      if (!restaurant) throw new Error("Restaurant didn't exist!")

      res.render('dashboard', { restaurant })
    } catch (err) { next(err) }
  }
}
module.exports = restaurantController
