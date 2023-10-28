const restaurantServices = require('../../services/restaurant-services')

// Controllers - 處理流程控制，負責接收資料來源及整理回傳結果
const restaurantController = {
  // 餐廳首頁
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = restaurantController
