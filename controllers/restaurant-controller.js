const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || '' // 新增這裡，從網址上拿下來的參數是字串，先轉成 Number 再操作

      const promiseData = await Promise.all([
        Restaurant.findAll({
          include: Category,
          where: {
            ...categoryId ? { categoryId } : {}
          },
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])
      const restaurants = await promiseData[0].map(restaurant => ({
        ...restaurant,
        description: restaurant.description.substring(0, 50)
      }))
      const categories = promiseData[1]

      return res.render('restaurants', {
        restaurants,
        categories,
        categoryId
      })
    } catch (error) {
      return next(error)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id,
        {
          include: Category,
          nest: true,
          raw: true
        })

      if (!restaurant) throw new Error("Restaurant didn't exist!")

      return res.render('restaurant', { restaurant })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = restaurantController
