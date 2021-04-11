const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const helpers = require('../_helpers')
const sequelize = require('sequelize')

const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.categoryId = categoryId
    }

    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    })
      .then(result => {
        // data for pagination
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)  // default starts from 0
        const prev = page - 1 < 1 ? 1 : page - 1   // if page - 1 < 1 is true, prev = 1; if false, prev = page - 1
        const next = page + 1 > pages ? pages : page + 1   // if page + 1 > pages is true, next = pages; if false, next = page + 1

        // clean up restaurant data
        const data = result.rows.map(r => ({    // result.rows has the data we need
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.dataValues.Category.name,
          isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id),
          isLiked: helpers.getUser(req).LikedRestaurants.map(d => d.id).includes(r.id)
        }))

        Category.findAll({
          raw: true,
          nest: true
        })
          .then(categories => {
            return res.render('restaurants', {
              restaurants: data,
              categories: categories,
              categoryId: categoryId,
              page: page,
              totalPage: totalPage,
              prev: prev,
              next: next
            })
          })
      })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },   // check if this user is among the ones who added this restaurant to favorites
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }     // include another model (Comment), and another one related to Comment which is User, to get the user's name value
      ]
    })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(helpers.getUser(req).id)  // find this user that added this restaurant to his favorite
        const isLiked = restaurant.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
        restaurant.viewCounts = restaurant.viewCounts ? restaurant.viewCounts + 1 : 1  // if there is already viewCounts, whenever visit, add 1 to it; if not visited before, remain 1
        restaurant.save()
        return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
      })
      .catch(err => console.log(err))
  },

  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    })
  },

  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    })
      .then(restaurant => {
        return res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => console.log(err))
  },

  getTop10: async (req, res) => {
    let restaurants = await Restaurant.findAll({
      include: { model: User, as: 'FavoritedUsers' },
      attributes: [
        'id',
        'description',
        'image',
        'name',
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM Favorites WHERE Favorites.RestaurantId = Restaurant.id GROUP BY Favorites.RestaurantId)'
          ),
          'favCount'
        ]
      ],
      order: [[sequelize.literal('favCount'), 'DESC']],
      limit: 10
    })

    // Clean up restaurants data
    const favRestaurants = helpers.getUser(req).FavoritedRestaurants.map(
      favRestaurant => favRestaurant.id
    )

    restaurants = restaurants.map(restaurant => ({
      ...restaurant.dataValues,
      description: restaurant.description.substring(0, 50),
      favCount: restaurant.FavoritedUsers.length,
      isFavorited: favRestaurants.includes(restaurant.id)
    }))

    res.render('top10', { restaurants })
  }
}

module.exports = restController