
const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const restaurantController = {
  // (頁面) 瀏覽所有餐廳-首頁
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    // 空字串轉數字是0，是falsy，得到categoryId=''
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT

    const offset = getOffset(limit, page)

    return Promise.all([Restaurant.findAndCountAll({
      where: categoryId ? { categoryId } : {},
      raw: true,
      nest: true,
      include: Category,
      limit,
      offset
    }), Category.findAll({ raw: true })])
      .then(([restaurants, categories]) => {
        const FavoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const LikedRestaurantsId = req.user && req.user.LikedRestaurants.map(li => li.id)

        // 把餐廳敘述截至50個字，避免過長時版面亂掉
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: FavoritedRestaurantsId.includes(r.id),
          isLiked: LikedRestaurantsId.includes(r.id)
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
  // (頁面) 瀏覽單一餐廳資料
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      {
        include: [Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ],
        nest: true
      })
      .then(restaurant => {
        // console.log(restaurant.Comments[0].dataValues) // 此時還不是plain OBJ，加.dataValues取值
        const isFavorited = restaurant.FavoritedUsers.some(fr => fr.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(li => li.id === req.user.id)

        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment({ viewCounts: 1 })
          .then(() => res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked }))
      })
      .catch(err => next(err))
  },
  // (頁面) 顯示單一餐廳的Dashboard
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      { nest: true, include: [Category, Comment, { model: User, as: 'FavoritedUsers' }] })
      .then(restaurant => res.render('dashboard', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  // (頁面) 顯示最新消息
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
      .then(([restaurants, comments]) => res.render('feeds', { restaurants, comments }))
      .catch(err => next(err))
  },
  // (頁面) 顯示top restaurants
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({ nest: true, include: [Category, { model: User, as: 'FavoritedUsers' }] })
      .then(restaurants => {
        // 整理資料，排序後取出前10筆
        restaurants = restaurants
          .map(restaurant => ({
            ...restaurant.toJSON(),
            favoritedCount: restaurant.FavoritedUsers.length,
            categoryName: restaurant.Category ? restaurant.Category.dataValues.name : '未分類', // 不加'restaurant.Category ? :'測試會報錯
            isFavorited: req.user && restaurant.FavoritedUsers.some(user => user.id === req.user.id) // 不加'req.user && '測試會報錯
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)

        // console.log(restaurants)

        return res.render('top-restaurants', { restaurants })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
