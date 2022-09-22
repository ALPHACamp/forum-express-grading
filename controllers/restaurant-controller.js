// restaurantController 物件裡面有 getRestaurants 方法
// getRestaurants 裡面存放一個中介軟體，這個中介軟體專門處理接收到的 req
const { Restaurant, Category, User } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ // [{}, {}...]
      include: 'Category',
      nest: true,
      raw: true
    }).then(restaurants => { // 做縮字整理至 50 字
      const data = restaurants.map(restaurant => {
        return {
          ...restaurant,
          description: restaurant.description.substring(0, 50) // 沒有寫 rest 會出 description 還沒定義的錯誤
        }
      })
      res.render('restaurants', { restaurants: data })
    }).catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      include: 'Category',
      raw: true,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant isn't exist!")

        res.render('restaurant', { restaurant })
      }).catch(error => next(error))
  }
}

module.exports = restaurantController // 匯出才能在其他檔案中使用
