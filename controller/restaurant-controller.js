// restaurantController 物件裡面有 getRestaurants 方法
// getRestaurants 裡面存放一個中介軟體，這個中介軟體專門處理接收到的 req

const restaurantController = {
  getRestaurants: (req, res) => {
    res.render('restaurants')
  }
}

module.exports = restaurantController // 匯出 restaurantController 才能在其他檔案中使用
