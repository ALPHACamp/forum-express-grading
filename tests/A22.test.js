const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const app = require('../app')
const helpers = require('../_helpers');
const SequelizeMock = require('sequelize-mock');
const proxyquire = require('proxyquire');

const dbMock = new SequelizeMock({autoQueryFallback: false});

const mockRequest = (query) => {
  return {
    ...query,
    flash: sinon.spy() 
  };
};
const mockResponse = () => {
  return {
    redirect: sinon.spy(),
    render: sinon.spy(),
  }
};
// 模擬的餐廳資料
let mockRestaurantData = [{
  id: 1,
  name: 'Restaurant1',
  tel: 'tel',
  address: 'address',
  opening_hours: 'opening_hours',
  description: "test description",
  FavoritedUsers: [{
    UserId: 1,
  }]
}, {
  id: 2,
  name: 'Restaurant2',
  tel: 'tel',
  address: 'address',
  opening_hours: 'opening_hours',
  description: 'description',
  CategoryId: 1,
  FavoritedUsers: []
}]

describe('# A22: TOP 10 人氣餐廳 ', function () {

  context('# [網址正確、畫面正常執行]', () => {
    before(async () => {
      // 模擬驗證資料
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, Followings: [], FavoritedRestaurants: [] });
    })

    it(" GET /restaurants/top ", (done) => {
      request(app)
        .get('/restaurants/top')
        .end(function (err, res) {
          // 檢查回傳的資料中，是否有 Top 10 人氣餐廳資訊
          res.text.should.include('Top 10 人氣餐廳')  // 可以正確執行，沒有 error 即可通過
          done()
        });
    });

    after(async () => {
      // 清除模擬驗證資料
      this.ensureAuthenticated.restore();
      this.getUser.restore();
    })

  })

  context('# [當你點擊畫面上的「加入最愛 / 移除最愛」按鈕時，會重新計算「收藏數」的數字]', () => {
    before(async () => {
      // 模擬驗證資料
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, Followings: [], FavoritedRestaurants: [] });

      // 模擬 Restaurant db 資料
      this.restaurantMock = dbMock.define('Restaurant');
      this.restaurantMock.$queryInterface.$useHandler((query, queryOptions,done) => {
        if (query === 'findAll') {
          return Promise.resolve(mockRestaurantData.map(d => this.restaurantMock.build(d)));
        }
      });

      // 將 restController 中的 Restaurant db 取代成 Restaurant mock db
      this.restController = proxyquire('../controllers/restController', {
        '../models': {
          Restaurant: this.restaurantMock,
        }
      });

      // 模擬 Favorite db 資料
      this.favoriteMock = dbMock.define('Favorite');
      this.favoriteMock.create = this.favoriteMock.upsert;
      this.favoriteMock.$queryInterface.$useHandler((query, queryOptions,done) => {
        if (query === 'upsert') {
          // 新增 favortie 資料到模擬資料
          const {UserId, RestaurantId} = queryOptions[0];
          const restaurant = mockRestaurantData.find(d => d.id === RestaurantId);
          restaurant.FavoritedUsers.push({UserId: UserId});
          return Promise.resolve(mockRestaurantData.map(d => this.restaurantMock.build(d)));
        } else if (query === 'destroy') {
          // 刪除模擬資料中的某一筆 favortie 資料
          const {UserId, RestaurantId} = queryOptions[0].where;
          const restaurant = mockRestaurantData.find(d => d.id === RestaurantId);
          restaurant.FavoritedUsers = restaurant.FavoritedUsers.filter(d => !(d.UserId === UserId))
          return Promise.resolve(mockRestaurantData.map(d => this.restaurantMock.build(d)));
        }
      });

      // 將 userController 中的 Favorite db 取代成 Favorite mock db
      this.userController = proxyquire('../controllers/userController', {
        '../models': {Favorite: this.favoriteMock}
      })
    })

    it(" POST favorite ", async () => {
      // 模擬 request 新增 user id = 1, 喜愛 restaurant id = 2
      const req = mockRequest({user: { FavoritedRestaurants: []}, params: {restaurantId: 2}});
      const res = mockResponse();

      // call addFavorite
      await this.userController.addFavorite(req, res);

      // 確認 getTopRestaurant 取得餐廳 2 的 favorite 數量會不同 
      await this.restController.getTopRestaurant(req, res);

      res.render.getCall(0).args[1].restaurants[1].FavoritedCount.should.equal(1);
    })

    it(" DELETE favorite ", async() => {
      // 模擬 request 新增 user id = 1, 不喜愛 restaurant id = 1
      const req = mockRequest({user: { FavoritedRestaurants: []}, params: {restaurantId: 1}});
      const res = mockResponse();

      // call removeFavorite
      await this.userController.removeFavorite(req, res);
      // 取得餐廳排序資料
      await this.restController.getTopRestaurant(req, res);

      // 確認餐廳排序有變，第一個餐廳資料 id = 2
      res.render.getCall(0).args[1].restaurants[0].id.should.equal(2);
    })

    after(async () => {
      // 清除模擬驗證資料
      this.ensureAuthenticated.restore();
      this.getUser.restore();
    })

  })

})