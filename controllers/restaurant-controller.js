const { Restaurant, Category } = require('../models')
const { deletedCategoryFilter } = require('../helpers/deleted-filter-helper')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || '' // 注意req.query是字串要轉型別，全部要給空字串
    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
          // 要注意空物件永遠是true，這邊用成物件展開是為了擴充 實際上拿掉也可以跑
        }
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        restaurants = restaurants.map(r => ({ // 小括號代替return
          ...r,
          description: r.description.substring(0, 50) // 雖然展開的時候也有屬性了，但後面的keyvalue可以覆蓋前面的keyvalue
        })
        )
        categories = deletedCategoryFilter(categories)
        return res.render('restaurants', { restaurants, categories, categoryId })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(async restaurant => {
        if (!restaurant) throw new Error('此餐廳不存在')
        await restaurant.increment('viewCounts')
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
