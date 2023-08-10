const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // limit: 限制查幾筆資料。 req.query.limit 留給未來擴充的空間
    const offset = getOffset(limit, page) // 偏移量
    // findAndCountAll 取出的資料有row、count屬性
    return Promise.all([Restaurant.findAndCountAll({
      raw: true,
      nest: true,
      where: { ...categoryId ? { categoryId } : {} },
      limit,
      offset,
      include: Category
    }),
    Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        // 將首頁顯示的description截至50個字
        // 展開運算子和物件搭配時，通常是用在想要拷貝物件並做出做局部修改的時候
        const data = restaurants.rows.map(r => ({
          ...r,
          // 修改description，若出現重複的key則會以後面的為準
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data, categories, categoryId, pagination: getPagination(limit, page, restaurants.count) })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("restaurant didn't exist!")
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        if (!restaurant) throw new Error("restaurant didn't exist!")
        res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'Desc']],
        include: Category,
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'Desc']],
        include: [Restaurant, User],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
