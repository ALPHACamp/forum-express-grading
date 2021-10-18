const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const db = require('../models')
const helpers = require('../_helpers')
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

let mockLikeData = [{
  UserId: 1,
  RestaurantId: 2,
}]

describe('# A21: Like / Unlike', function () {

  context('# Q1: 使用者可以 Like 餐廳', () => {
    before(() => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1});
      this.mockLikeData = [];
      this.likeMock = dbMock.define('Like');
      this.likeMock.create = this.likeMock.upsert;

      this.likeMock.$queryInterface.$useHandler((query, queryOptions,done) => {
        if (query === 'upsert') {
          const {UserId, RestaurantId} = queryOptions[0];
          
          this.mockLikeData.push({ UserId, RestaurantId });
          
          return Promise.resolve(this.likeMock.build(this.mockLikeData));
        } else if (query === 'findAll') {
          return Promise.resolve(this.mockLikeData);
        }
      });

      this.userController = proxyquire('../controllers/userController', {
        '../models': {Like: this.likeMock}
      });
    })

    it(" POST /like/:restaurantId ", async () => {
      const req = mockRequest({params: {id: 1, restaurantId: 2}});
      const res = mockResponse();

      await this.userController.addLike(req, res);

      const likes = await this.likeMock.findAll();
      console.log(likes);
      likes.should.have.lengthOf(1);
    });

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
    })
  })

  context('# Q1: 使用者可以 unLike 餐廳', () => {
    before(() => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1});
      this.likeMock = dbMock.define('Like', {
        id: 1,
        UserId: 1,
        RestaurantId: 2,
      });

      this.likeMock.$queryInterface.$useHandler((query, queryOptions,done) => {
        if (query === 'destroy') {
          const {UserId, RestaurantId} = queryOptions[0].where;
          mockLikeData = mockLikeData.filter(d => !(d.UserId === UserId && d.RestaurantId === RestaurantId))

          return Promise.resolve(this.likeMock.build(mockLikeData));
        } else if (query === 'findAll') {
          return Promise.resolve(mockLikeData);
        }
      });

      this.userController = proxyquire('../controllers/userController', {
        '../models': {Like: this.likeMock}
      });
    })

    it(" DELETE /like/:restaurantId ", async () => {
      const req = mockRequest({params: {id: 1, restaurantId: 2}});
      const res = mockResponse();

      await this.userController.removeLike(req, res);

      const likes = await this.likeMock.findAll();
      likes.should.have.lengthOf(0);
    });

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
    })
  });
})