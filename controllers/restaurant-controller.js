const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const restaurantController = {
  // 多筆
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9

    const categoryId = Number(req.query.categoryId) || ''

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    // findAndCountAll return an object with { rows, counts}
    // where 會引響到找到多少符合條件的 records
    // limit 會引響拿幾筆 records 讓速度更快
    // offset 會引響從第幾筆 records 開始拿資料
    // rows 是資料 counts 是符合 where 條件的資料有多少，這跟limit, offset 沒有關係
    // 例如符合 where 條件的餐廳有20筆，limit是10，回傳結果： rows 10 筆資料，count 是 20 (number)
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        // 取出使用者的 FavoritedRestaurants (從 passport中取出)
        const favoritedRestaurants = req.user.FavoritedRestaurants

        // 取出使用者的 LikedRestaurants (從 passport中取出)
        const likedRestaurants = req.user.LikedRestaurants

        // 處理每一筆餐廳資料
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurants.some(fr => fr.id === r.id),
          isLiked: likedRestaurants.some(fr => fr.id === r.id)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count),
          limit
        })
      })
      .catch(err => next(err))
  },

  // 單筆
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUser' },
        { model: User, as: 'LikedUser' }
      ],
      order: [
        [Comment, 'id', 'DESC']
      ],
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant did not exist!')
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUser.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUser.some(f => f.id === req.user.id)

        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },

  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category, Comment]
      })

      return res.render('dashboard', {
        restaurant: restaurant.toJSON()
      })
    } catch (err) {
      next(err)
    }
  },

  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
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
        if (!restaurants) throw new Error('Can not find restaurants!')
        if (!comments) throw new Error('Can not find restaurants!')

        res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
