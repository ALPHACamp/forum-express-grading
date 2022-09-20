const restaurantController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}

// 匯出，才能被其他檔案使用
module.exports = restaurantController
