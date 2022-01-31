const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)

        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50) + '...',
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        console.log(data.length)

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
    const userId = req.user.id
    const restaurantId = req.params.id

    return Restaurant.findByPk(restaurantId, {
      include: [
        { model: Category },
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")

        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        restaurant = restaurant.toJSON()
        const isFavorited = restaurant.FavoritedUsers.some(
          f => f.id === userId
        )
        const isLiked = restaurant.LikedUsers.some(
          l => l.id === userId
        )

        return res.render('restaurant', {
          restaurant, isFavorited, isLiked
        })
      })
      .catch(err => next(err))
  },

  getDashboard: (req, res, next) => {
    const { id } = req.params

    return Restaurant.findByPk(id, {
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")

        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  },

  getFeeds: (req, res, next) => {
    const queryOptions = {
      limit: 10,
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    }

    return Promise.all([
      Restaurant.findAll({
        ...queryOptions,
        include: Category
      }),
      Comment.findAll({
        ...queryOptions,
        include: [Restaurant, User]
      })
    ])
      .then(([restaurants, comments]) => {
        return res.render('feeds', {
          restaurants, comments
        })
      })
      .catch(err => next(err))
  },

  getTopRestaurants: (req, res, next) => {
    const resultArray = []

    return Restaurant.findAll({
      include: { model: User, as: 'FavoritedUsers' },
      nest: true
    })
      .then(restaurants => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)

        const result = restaurants.map(r => ({
          ...r.dataValues,
          description: r.description.substring(0, 100) + '...',
          favoritedCount: r.FavoritedUsers.length,
          isFavorited: favoritedRestaurantsId?.some(id => id === r.id) || false
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)

        for (let i = 0; i < result.length; i++) {
          if (i < 10) {
            resultArray.push(result[i])
          } else break
        }

        return res.render('top-restaurants', {
          restaurants: resultArray
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
