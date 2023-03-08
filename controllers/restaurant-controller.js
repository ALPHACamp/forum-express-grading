const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9

    const categoryId = Number(req.query.categoryId) || '' // 還不知 或 當空字元的原因
    // const categoryId = +req.params.categoryId || '' // 與上同意，之後查 + 的用處
    console.log(categoryId)

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 前面的 Number(...)，只是留著，未來要用可用
    const offset = getOffset(limit, page)

    // const where = {}

    // if (categoryId) where.categoryId = categoryId

    Promise.all([
      Restaurant.findAndCountAll({
        nest: true,
        raw: true,
        include: [Category],
        limit,
        offset,
        where: { // 這個 where 的 value，物件包物件，原來能這樣
          ...categoryId ? { categoryId } : {} // 這裡的 ...，我猜不是展開運算子，畢竟下面實驗失敗，而且，categoryId 明明就是"一個"數字，為啥要展開？
          // categoryId ? { categoryId } : {}
        }
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
      // console.log(restaurants) // 觀察 include
      // (下1) 不錯，運用展開運算子跟箭頭函式，直接改 object 內容
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
    return Restaurant.findByPk(req.params.id, {
      include: Category // 拿出關聯的 Category model
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('viewCounts', { by: 1 }) //! 教案方法，聰明很多，記下來
        // restaurant.update({ viewCounts: restaurant.viewCounts++ }) // 我的方法，土法煉鋼
        restaurant = restaurant.toJSON()
        return res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
