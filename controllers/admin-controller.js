// 建立一個名為 adminController 的object
// adminController object 中有一個方法叫做 getRestaurants，負責「瀏覽餐廳頁面」，也就是去 render 名為 restaurants 的hbs

const adminController = {
  getRestaurants: (req, res) => {
    return res.render('admin/restaurants')
  }
}
module.exports = adminController
