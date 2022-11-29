const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res,next) => {
    const categoryId = parseInt(req.query.categoryId) || '' // 新增這裡，從網址上拿下來的參數是字串，先轉成 Number 再操作
    return Promise.all([
      Restaurant.findAll({
        include: Category,
        where: {  // 新增查詢條件
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
          categoryId // 新增這裡
        })
      })
      .catch(err => next(err)) // 補上
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      include: Category,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return restaurant.increment('viewCounts', { by: 1 })       
      })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      raw: true,
      include: Category,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return res.render('dashboard', { restaurant: restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController