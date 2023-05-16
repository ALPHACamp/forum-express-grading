const restaurantController = {
  // *因為restaurantController 有不同的方法，目前這個是負責瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restaurantController