const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => { // 瀏覽所有餐廳頁面:運用展開運算子 ...
    const categoryId = Number(req.query.categoryId) || '' // 從網址上拿下來的參數是字串，先轉成 Number 再操作

    // const where = {}
    // if (categoryId) where.categoryId = categoryId

    return Promise.all([
      Restaurant.findAll({
        include: Category,
        // where: where,
        where: { // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        },
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
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => { // 瀏覽單筆餐廳頁面
    return Restaurant.findByPk(req.params.id, {
      include: Category
    }).then(restaurant => {
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return restaurant.increment('viewCounts')
    }).then(restaurant => {
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { // 顯示dashboard
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
