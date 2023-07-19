const adminController = {
  getRestaurants: (req, res) => {
    res.render('admin/restaurants') // admin前面不要加forward slash
  }
}

module.exports = { adminController }
