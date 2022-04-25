const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    const categoryId = Number(req.query.categoryId) || '' // 從網址上拿下來的參數是字串
    const where = {}
    if (categoryId) where.categoryId = categoryId
    return Promise.all([
      Restaurant.findAll({
        include: Category,
        where: where,
        // where: { // 新增查詢條件
        //   ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        // },
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId
        })
      })
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('view_counts')
      // await restaurant.reload()
      return res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
    if (!restaurant) throw new Error("Restaurant didn't exist!")
    res.render('dashboard', {
      restaurant
    })
  }
}
module.exports = restaurantController
