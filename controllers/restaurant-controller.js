// restaurantController 是一個物件 (object)。
// restaurantController 有不同的方法，例如 getRestaurants
const restaurantController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}

// 匯出之後才能在其他檔案裡使用。
module.exports = restaurantController
