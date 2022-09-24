const { Restaurant, Category, Comment, User } = require('../models')
const { getUser } = require('./../helpers/auth-helpers')

exports.getRestaurants = async (req, res, next) => {
  try {
    const pageSize = 15
    const currPage = +req.query.page || 1
    const categoryId = +req.query.categoryId || ''
    const { count, rows } = await Restaurant.findAndCountAll({
      offset: (currPage - 1) * pageSize,
      limit: pageSize,
      where: {
        ...categoryId ? { categoryId } : {}
      },
      include: Category,
      nest: true
    })
    const categories = await Category.findAll({
      raw: true
    })
    if (currPage > Math.ceil(count / pageSize)) {
      req.flash('error_messages', '頁面不存在')
      return res.redirect('/restaurants')
    }
    const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
    const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(({ id }) => id)
    const pages = Array.from({ length: Math.ceil(count / pageSize) }, (_, i) => Number(i + 1))
    const restaurants = rows.map(({ dataValues }) => ({
      ...dataValues,
      description: dataValues.description.substring(0, 50),
      isFavorited: favoritedRestaurantsId.includes(dataValues.id),
      isLiked: likedRestaurantsId.includes(dataValues.id),
      Category: dataValues.Category.dataValues
    }))
    const nextPage = currPage === pages.length ? 0 : currPage + 1
    const prevPage = currPage - 1
    return res.render('restaurants', {
      restaurants,
      pages,
      nextPage,
      prevPage,
      currPage,
      categories,
      categoryId
    })
  } catch (err) {
    next(err)
  }
}

exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ],
      nest: true
    })
    if (!restaurant) {
      throw new Error('Restaurant not found')
    }
    const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
    const isLiked = restaurant.LikedUsers.some(({ id }) => id === req.user.id)
    await restaurant.increment('viewCount')
    return res.render('restaurant', {
      restaurant: restaurant.toJSON(),
      isFavorited,
      isLiked
    })
  } catch (error) {
    next(error)
  }
}

exports.getDashboard = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
      include: [
        Category,
        { model: Comment, include: User }
      ],
      nest: true
    })
    if (!restaurant) {
      throw new Error('Restaurant not found')
    }
    const restaurantJSON = restaurant.toJSON()
    return res.render('dashboard', { restaurant: restaurantJSON })
  } catch (error) {
    next(error)
  }
}

exports.getFeeds = async (req, res, next) => {
  try {
    const promises = Promise.all([
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
    const [restaurants, comments] = await promises
    return res.render('feeds', { restaurants, comments })
  } catch (err) {
    next(err)
  }
}

exports.getTopRestaurants = async (req, res, next) => {
  try {
    let restaurants = await Restaurant.findAll({

      // attributes: {
      //   include: [
      //     [sequelize.literal('(SELECT COUNT(*) FROM Favorites WHERE Favorites.restaurant_id = Restaurant.id)'), 'favoritedCount']
      //   ]
      // },
      // order: [[sequelize.literal('favoritedCount'), 'DESC']],
      // limit: 10
      include: { model: User, as: 'FavoritedUsers' }
    })
    restaurants = restaurants.map(restaurant => (
      {
        ...restaurant.toJSON(),
        isFavorited: req.user && getUser(req).FavoritedRestaurants.some(({ id }) => id === restaurant.id),
        favoritedCount: restaurant.FavoritedUsers.length
      })).sort((a, b) => b.favoritedCount - a.favoritedCount)
      .slice(0, 10)

    return res.render('top-restaurants', { restaurants })
  } catch (err) {
    next(err)
  }
}
