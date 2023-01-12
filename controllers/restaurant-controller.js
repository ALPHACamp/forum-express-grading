/* For front-end system */

const restaurantController = {
  // the object
  getRestaurants: (req, res) => {
    return res.render('restaurants');
  }
};

module.exports = restaurantController;
