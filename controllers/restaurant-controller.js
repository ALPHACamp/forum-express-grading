// mvc分流裡的controller

const restaurantController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}

module.exports = restaurantController
// /restaurantController 是一個物件 (object)
// restaurantController 有不同的方法，例如 getRestaurants ，這個方法目前是負責「瀏覽餐廳頁面」，也就是去 render 一個叫做 restaurants 的樣板
