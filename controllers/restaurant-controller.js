const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  // getRestaurants => 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    const categoryId = Number(req.query.categoryId) || ''
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          // 新增查詢條件 categoryId 是否為空值
          ...(categoryId ? { categoryId } : {})
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ]).then(([restaurants, categories]) => {
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        // 從 categoryId 取 Category name
        Category,
        // 從 restaurant 找 Comment model 再找 comment 的 user
        { model: Comment, include: User }
      ]
    })
      .then(restaurant => {
        // console.log(restaurant.Comments[0].dataValues)
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => {
        res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  },
  // dashboard
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category],
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']], // 降序
        include: [Category], // 引入的 Model
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
