// restaurantController 物件裡面有 getRestaurants 方法
// getRestaurants 裡面存放一個中介軟體，這個中介軟體專門處理接收到的 req
const { Restaurant, Category, User } = require('../models')

const restaurantController = {

  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || '' // 按其他類別 || 預設沒有按
    return Promise.all([
      Restaurant.findAll({ // [{}, {}...]
        include: 'Category',
        where: {
          ...(categoryId ? { categoryId } : {})
        }, // categoryId 有值 { categoryId } + ... -> categoryId
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true }) // 這邊就不用 nest
    ])
      .then(([restaurants, categories]) => { // 做縮字整理至 50 字
        const data = restaurants.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description.substring(0, 50) // 沒有寫 rest 會出 description 還沒定義的錯誤
          }
        })
        res.render('restaurants', { restaurants: data, categories, categoryId })
      }).catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      include: 'Category'
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant isn't exist!")

        restaurant.increment('view_count', { by: 1 }) // 這邊要注意是否需要註記順序??
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
