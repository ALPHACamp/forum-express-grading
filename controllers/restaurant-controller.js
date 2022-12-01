const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || '' // 從網址上拿下來的參數是字串轉成Number

    const page = Number(req.query.page) || 1 // 來自views的內容或者第1頁
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 來自views的內容或者9筆資料
    const offset = getOffset(limit, page) // 藉由page和limit算出offset

    return Promise.all([
      Restaurant.findAndCountAll({ // 改成findAndCountAll是為了最後要取得restaurants.count
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {} // 檢查categoryId是否為空值
        },
        limit, // 對restaurants DB查詢
        offset, // 對restaurants DB查詢 => offset幾筆後，limit顯示幾筆
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        // console.log(req.query) => 從?page=2&categoryId=2獲得{page:2, categoryId:2}
        const data = restaurants.rows.map(r => ({
          ...r, // 展開運算子將每一筆restaurant的資料展開後用data接住，展開後的description會被下方新的description賦值
          description: r.description.substring(0, 50) // 將餐廳文字描述截斷為50字元的長度
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
      include: Category,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant', { restaurant: restaurant.toJSON() })
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
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
