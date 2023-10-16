// 負責處理前台餐廳相關的請求 (request)
const restaurantController = {
  // restaurantController是一個物件
  // getRestaurants負責處理瀏覽餐廳頁面的函式，主要為render restaurants 的樣板
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}

module.exports = restaurantController
