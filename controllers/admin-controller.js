/* For back-end system */

const adminController = {
  // the object
  getRestaurants: (req, res) => {
    return res.render('admin/restaurants');
  }
};

module.exports = adminController;
