const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || '' // 新增這裡，從網址上拿下來的參數是字串，先轉成 Number 再操作
    const restaurantsFiltered = {}
    if (categoryId) restaurantsFiltered.categoryId = categoryId

    const DEFAULT_LIMIT = 9 // 代表我們想要一頁有 9 筆餐廳資料
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page) // 增加這裡

    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: restaurantsFiltered,
        limit, // 增加這裡
        offset, // 增加這裡
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({ // 修改這裡加上.rows
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count) // 修改這裡，把 pagination 資料傳回樣板
        })
      })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, { model: Comment, include: User }], // 拿出關聯的 Category model
      nest: true // 移除raw: true，因資料尚需處理，還不能轉換成JS格式
    })
      .then(restaurant => {
        console.log(restaurant.Comments[0])
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category model
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', {
          restaurant
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
