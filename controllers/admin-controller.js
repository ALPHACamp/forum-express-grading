const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      return res.render('admin/restaurants')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
