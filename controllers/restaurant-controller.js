const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: (req, res) => {
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page) 
    
    const categoryId = Number(req.query.categoryId)|| ''
    const where = {}
    if (categoryId){where.categoryId =categoryId}
    Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where,
        limit, 
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({raw:true})
    ])
   .then(([restaurants,categories]) => {
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data, 
        categories, 
        categoryId, 
        pagination: getPagination(limit, page, restaurants.count)
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: false
    })
    .then(restaurant => {
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      restaurant.increment('viewCounts')
      res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
    .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: false
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', {
          restaurant:restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
