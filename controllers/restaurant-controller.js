// 建立一個名為 restaurantController 的object
// restaurantController object 中有一個方法叫做 getRestaurants，負責「瀏覽餐廳頁面」，也就是去 render 名為 restaurants 的hbs

const restaurantController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restaurantController
