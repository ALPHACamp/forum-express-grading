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
          done()
        });
    });

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
    })

  })

  context('# [當你點擊畫面上的「加入最愛 / 移除最愛」按鈕時，會重新計算「收藏數」的數字]', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, Followings: [], FavoritedRestaurants: [] });

      this.restaurantMock = dbMock.define('Restaurant');
      this.restaurantMock.$queryInterface.$useHandler((query, queryOptions,done) => {
        if (query === 'findAll') {
          return Promise.resolve(mockRestaurantData.map(d => this.restaurantMock.build(d)));
        }
      });
      this.restController = proxyquire('../controllers/restController', {
        '../models': {
          Restaurant: this.restaurantMock,
        }
      });

      this.favoriteMock = dbMock.define('Favorite');
      this.favoriteMock.create = this.favoriteMock.upsert;
      this.favoriteMock.$queryInterface.$useHandler((query, queryOptions,done) => {
        if (query === 'upsert') {
          const {UserId, RestaurantId} = queryOptions[0];
          const restaurant = mockRestaurantData.find(d => d.id === RestaurantId);
          restaurant.FavoritedUsers.push({UserId: UserId});
          return Promise.resolve(mockRestaurantData.map(d => this.restaurantMock.build(d)));
        } else if (query === 'destroy') {
          const {UserId, RestaurantId} = queryOptions[0].where;
          const restaurant = mockRestaurantData.find(d => d.id === RestaurantId);
          restaurant.FavoritedUsers = restaurant.FavoritedUsers.filter(d => !(d.UserId === UserId))
          return Promise.resolve(mockRestaurantData.map(d => this.restaurantMock.build(d)));
        }
      });

      this.userController = proxyquire('../controllers/userController', {
        '../models': {Favorite: this.favoriteMock}
      })
    })

    it(" POST favorite ", async () => {
      const req = mockRequest({user: { FavoritedRestaurants: []}, params: {restaurantId: 2}});
      const res = mockResponse();

      await this.userController.addFavorite(req, res);
      await this.restController.getTopRestaurant(req, res);

      res.render.getCall(0).args[1].restaurants[1].FavoritedCount.should.equal(1);
    })

    it(" DELETE favorite ", async() => {
      const req = mockRequest({user: { FavoritedRestaurants: []}, params: {restaurantId: 1}});
      const res = mockResponse();

      await this.userController.removeFavorite(req, res);
      await this.restController.getTopRestaurant(req, res);

      res.render.getCall(0).args[1].restaurants[0].id.should.equal(2);
    })

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
    })

  })

})