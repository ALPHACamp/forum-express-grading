/* For back-end system */
const { Restaurant } = require('../models');
const { localFileHandler } = require('../helpers/file-helpers');

const adminController = {
  // the object
  getRestaurants: (req, res, next) => {
    //  note raw 是讓資料呈現簡化為單純的JS物件，若是不加的話，則會是原生Sequelize的instance，除非需要對後續取得的資料操作，才不加。
    Restaurant.findAll({ raw: true })
      .then(restaurants => {
        // console.log(restaurants);
        res.render('admin/restaurants', { restaurants });
      })
      .catch(err => next(err));
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant');
  },
  postRestaurant: (req, res, next) => {
    // !! note 雖然前端有用required來驗證，但是容易被修改，所以要在後端做一次驗證，避免被直接修改或侵入
    const { name, tel, address, openingHours, description } = req.body;
    if (!name) throw new Error('Restaurant name is required');

    const file = req.file;
    console.log(file);
    localFileHandler(file) // 先經multer處理後再給下面繼續
      .then(filePath => {
        return Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null
        });
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant was created successfully');
        res.redirect('/admin/restaurants');
      })
      .catch(err => next(err));
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist");

        res.render('admin/restaurant', { restaurant });
      })
      .catch(err => next(err));
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist");

        res.render('admin/edit-restaurant', { restaurant });
      })
      .catch(err => next(err));
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body;
    if (!name) throw new Error('Restaurant name is required');

    const { file } = req;
    // Thinking 需要找到餐廳資料，在處理相片的檔案，會有時間差為非同步，需要做同步處理
    // notice 注意parameter數量，Promise.all([a, b]).then([a, b])
    Promise.all([
      Restaurant.findByPk(req.params.id), // note 不使用raw是因為還需要利用Sequelize的instance進行資料操作，若是轉成JS則無法使用update()
      localFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist");

        // note return避免形成nest結構，較易閱讀，且update()也是個Promise
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image
        });
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant was updated successfully');
        res.redirect('/admin/restaurants');
      })
      .catch(err => next(err));
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist !!");

        return restaurant.destroy();
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err));
  }
};

module.exports = adminController;
