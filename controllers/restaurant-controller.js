const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9

    const categoryId = Number(req.query.categoryId) || ''

    const page = Number(req.query.page) || 1
    // req.query.limit for future use
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    Promise.all([
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
        const favoritedRestaurants = req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurants = req.user.LikedRestaurants.map(lr => lr.id)
        console.log(req.user)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurants.includes(r.id),
          isLiked: likedRestaurants.includes(r.id)
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
    const id = req.params.id

    Restaurant.findByPk(id, {
      nest: true,
      include: [
        Category,
        { model: Comment, as: 'Comments', include: User }
      ],
      order: [
        [{ model: Comment, as: 'Comments' }, 'created_at', 'DESC']
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant does not exist!')

        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        restaurant = restaurant.toJSON()
        res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id

    return Restaurant.findByPk(id, {
      nest: true,
      include: Category,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant does not exist!')

        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
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
        res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
