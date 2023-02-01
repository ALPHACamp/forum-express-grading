/* For back-end system */
const { Restaurant, User, Category } = require('../models');
const { imgurFileHandler } = require('../helpers/file-helpers');

const adminController = {
  // TODO  Read all restaurants
  getRestaurants: (req, res, next) => {
    //  note raw 是讓資料呈現簡化為單純的JS物件，若是不加的話，則會是原生Sequelize的instance，除非需要對後續取得的資料操作，才不加。
    // note nest 因取用兩個model，所以未加入的話則會變成'Category.name': 'XXX', 加入後可以變成Category: {xx:xx, xx:xx}，較方便操作
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category] // note 帶入另一個model
    })
      .then(restaurants => {
        res.render('admin/restaurants', { restaurants });
      })
      .catch(err => next(err));
  },
  // TODO Create the new restaurant data
  createRestaurant: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },
  postRestaurant: (req, res, next) => {
    // !! note 雖然前端有用required來驗證，但是容易被修改，所以要在後端做一次驗證，避免被直接修改或侵入
    const { name, tel, address, openingHours, description, categoryId } = req.body;
    if (!name) throw new Error('Restaurant name is required');

    const file = req.file;

    imgurFileHandler(file) // 先經multer處理後再給下面繼續
      .then(filePath => {
        return Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null,
          categoryId
        });
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant was created successfully');
        res.redirect('/admin/restaurants');
      })
      .catch(err => next(err));
  },
  // TODO Edit and Update the restaurant data
  getRestaurant: (req, res, next) => {
    // note 單筆資料操作可以不加入
    Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist");

        // ** method 單筆資料操作可以不加入raw and nest, 這樣的話最後則需要在render這塊進行toJSON()，例如：{ restaurant: restaurant.toJSON() }使其格式可以讓hbs讀到 */
        res.render('admin/restaurant', { restaurant });
      })
      .catch(err => next(err));
  },
  editRestaurant: (req, res, next) => {
    // notice 注意parameter數量，Promise.all([a, b]).then([a, b])
    return Promise.all([
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist");

        res.render('admin/edit-restaurant', { restaurant, categories });
      })
      .catch(err => next(err));
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body;
    if (!name) throw new Error('Restaurant name is required');

    const { file } = req;
    // Thinking 需要找到餐廳資料，在處理相片的檔案，會有時間差為非同步，需要做同步處理
    Promise.all([
      Restaurant.findByPk(req.params.id), // note 不使用raw是因為還需要利用Sequelize的instance進行資料操作，若是轉成JS則無法使用update()
      imgurFileHandler(file)
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
          image: filePath || restaurant.image,
          categoryId
        });
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant was updated successfully');
        res.redirect('/admin/restaurants');
      })
      .catch(err => next(err));
  },
  // TODO Delete the restaurant data
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
