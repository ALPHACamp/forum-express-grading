const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''

    const DEFAULT_LIMIT = 9
    // 保留 req.query.limit ，可以新增功能：選擇一頁要顯示幾筆資料
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const page = Number(req.query.page) || 1
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        where: {
          ...(categoryId ? { categoryId } : {})
        },
        limit,
        offset,
        include: Category,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({
          ...r,
          // 當 key 重複時，後面出現的會取代前面的
          description: r.description.substring(0, 50) // description 擷取前 50 個字元
        }))

        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        { model: Category }, //! 取得 restaurant.Category
        { model: Comment, include: [{ model: User }] } //! 取得 restaurant.Comments 、 restaurant.Comments.User
        // -簡寫
        // Category,
        // { model: Comment, include: User }
      ],

      //* 排序：讓最近的 comment 排在最上面
      order: [
        [{ model: Comment }, 'createdAt', 'DESC']
      ]
    })
      .then(async restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        await restaurant.increment('viewCounts') // 將 viewCounts 加一(預設)
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },

  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
