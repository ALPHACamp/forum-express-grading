const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9 // 預設值: 一頁9筆資料
    const categoryId = Number(req.query.categoryId) || '' // '' => 表"全部分類""
    const page = Number(req.query.page) || 1 // 若queryString沒有攜帶特定數字則傳入1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([Restaurant.findAndCountAll({
      raw: true,
      nest: true,
      include: Category,
      where: {
        ...categoryId ? { categoryId } : {} // 檢查categoryId是否為空值
      },
      limit,
      offset
    }),
    Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50) + '...'
        }))
        return res.render('restaurants', { restaurants: data, categories, categoryId, pagination: getPagination(limit, page, restaurants.count) })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User }]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        console.log(restaurant.Comments[0].dataValues)
        restaurant.increment('viewCounts', { by: 1 })

        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurant => res.render('dashboard', { restaurant }))
      .catch(err => next(err))
  }
}
module.exports = restaurantController
