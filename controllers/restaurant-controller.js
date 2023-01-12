const restaurantController = {
  // the object
  getRestaurants: (req, res) => {
    return res.render('restaurants');
    // eslint-disable-next-line comma-dangle
  }
};

module.exports = restaurantController;
