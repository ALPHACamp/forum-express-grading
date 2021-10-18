const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const helpers = require('../_helpers')
const SequelizeMock = require('sequelize-mock');
const proxyquire = require('proxyquire');

const dbMock = new SequelizeMock();


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

describe('# A20: 餐廳資訊整理：Dashboard', function() {
    
  context('# [Q1: Dashboard - 1 - controller / view / route]', () => {
    before(async() => {      
      this.UserMock = dbMock.define('User', {
        id: 1,
        email: 'root@example.com',
        name: 'admin',
        isAdmin: false,
      });
      this.RestaurantMock = dbMock.define('Restaurant', {
        id: 1,
        name: '銷魂麵'
      });
      this.CategoryMock = dbMock.define('Category', {
        id: 1,
        name: '食物'
      });
      this.CommentMock = dbMock.define('Comment', {
        id: 1,
        text: "gogogo"
      })

      this.RestaurantMock.belongsTo(this.CategoryMock);
      this.RestaurantMock.findByPk = (id) => this.RestaurantMock.findOne({where: {id: id}});
      this.CommentMock.count = () => 1;
      
      this.restController = proxyquire('../controllers/restController', {
        '../models': { 
          User: this.UserMock, 
          Category: this.CategoryMock, 
          Restaurant: this.RestaurantMock,
          Comment: this.CommentMock,
        }
      });
    })

    it(" GET /restaurants/:id/dashboard ", async () => {
      const req = mockRequest({params: {id: 1}});
      const res = mockResponse()

      await this.restController.getDashBoard(req, res);

      res.render.getCall(0).args[0].should.equal('dashboard');
      res.render.getCall(0).args[1].restaurant.name.should.equal('銷魂麵'); 
      res.render.getCall(0).args[1].n_comments.should.equal(1);
    });
  })
})