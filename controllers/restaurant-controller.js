// restaurantController 物件裡面有 getRestaurants 方法
const { Restaurant, Category, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || '' // 按其他類別 || 沒有按給預設（全部）
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 這邊預留未來可能讓使用者決定要顯示的筆數
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({ // [{}, {}...]
        include: 'Category',
        where: {
          ...(categoryId ? { categoryId } : {})
        }, // categoryId 有值 { categoryId } + ... -> categoryId，沒有值就忽略不查詢
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true }) // 這邊就不用 nest
    ])
      .then(([restaurants, categories]) => { // 做縮字整理至 50 字
        const data = restaurants.rows.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description.substring(0, 50) // 沒有寫 rest 會出 description 還沒定義的錯誤
          }
        })
        res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count) // restaurants.count === 資料總筆數
        })
      }).catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      include: 'Category'
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant isn't exist!")

        restaurant.increment('view_count', { by: 1 }) // 這邊要注意，不需要 nest
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      }).catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { include: 'Category', raw: true, nest: true, attributes: ['id', 'name', 'view_count'] }) // 為何??
      .then(restaurant => {
        res.render('dashboard', { restaurant })
      })
      .catch(error => next(error))
  }
}

module.exports = restaurantController // 匯出才能在其他檔案中使用
