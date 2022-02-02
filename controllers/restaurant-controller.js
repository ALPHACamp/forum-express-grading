const {
  Restaurant,
  Category
} = require('../models')
const {
  getOffset,
  getPagination
} = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9 // 每頁顯示9間餐廳
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId
            ? {
                categoryId
              }
            : {}
        },
        limit,
        offset, // 把limit和offset傳入，這樣sequelize在查詢的時候才知到要查詢幾筆資料
        nest: true,
        raw: true
      }),
      Category.findAll({
        raw: true
      })
    ])
      .then(([restaurants, categories]) => {
        console.log(restaurants)
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
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    const {
      Restaurant,
      Category,
      Comment,
      User
    } = require('../models')
    return Restaurant.findByPk(req.params.id, {
      include: [Category,
        {
          model: Comment,
          include: User
        }
      ]
    })
      .then(restaurant => {
        console.log(restaurant.Comments[0].dataValues)
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 每點擊一次就要增加一次瀏覽數
        return restaurant.increment('viewCount')
      })
      .then(restaurant => {
        res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  },
  // 渲染已經有算好瀏覽數的viewCount到前單樣版
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', {
          restaurant: restaurant
        })
      })
      .catch(err => next(err))
  }

}

module.exports = restaurantController
