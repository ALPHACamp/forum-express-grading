// 負責處理前台餐廳相關的請求 (request)
const { Restaurant, Category } = require('../models')

const restaurantController = {
  // restaurantController是一個物件
  // getRestaurants負責處理瀏覽餐廳頁面的函式，主要為render restaurants 的樣板
  getRestaurants: (req, res, next) => {
    // 因為handlebars中，有categories，因此這裡需要去抓Category的資料。

    const categoryId = Number(req.query.categoryId) // categoryId的值是從網址上提取上來(req.query)

    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
        where: {
          ...categoryId ? { categoryId } : {}
        }
      }),
      Category.findAll({ raw: true })
    ])

      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))

        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('此restaurant不存在')

        return restaurant.increment('viewCounts')
      })

      .then(() => {
        return Restaurant.findByPk(req.params.id, {
          include: [Category]
        })
      })

      .then(updateRestaurant => {
        res.render('restaurant', {
          restaurant: updateRestaurant.toJSON()
        })
      })

      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })

      .then(restaurant => {
        if (!restaurant) throw new Error('無法獲取更新後的restaurant')

        res.render('dashboard', {
          restaurant
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
