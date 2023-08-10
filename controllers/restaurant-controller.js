
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

        // 把餐廳敘述截至50個字，避免過長時版面亂掉
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: FavoritedRestaurantsId.includes(r.id)
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
          { model: User, as: 'FavoritedUsers' }],
        nest: true
      })
      .then(restaurant => {
        // console.log(restaurant.Comments[0].dataValues) // 此時還不是plain OBJ，加.dataValues取值
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)

        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment({ viewCounts: 1 })
          .then(() => res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited }))
      })
      .catch(err => next(err))
  },
  // (頁面) 顯示單一餐廳的Dashboard
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      { raw: true, nest: true, include: Category })
      .then(restaurant => res.render('dashboard', { restaurant }))
      .catch(err => next(err))
  },
  // (頁面) 顯示最新消息
  getFeeds: (req, res, next) => {
    Promise.all([
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
  }
}

module.exports = restaurantController
