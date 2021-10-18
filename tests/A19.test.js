const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const app = require('../../app')
const routes = require('../../routes/index')
const db = require('../../models')
const helpers = require('../../_helpers');
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
describe('# A19', () => {
  describe('# A19: 建立 User Profile', function() {
    context('# [瀏覽 Profile]', () => {
      before(() => {
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1});
        this.UserMock = dbMock.define('User', {
          id: 1,
          email: 'root@example.com',
          name: 'admin',
          isAdmin: false,
        });

        this.UserMock.findByPk = (id) => this.UserMock.findOne({where: {id: id}});
        
        this.userController = proxyquire('../../controllers/userController', {
          '../models': { User: this.UserMock }
        });
      })

      it(" GET /users/:id ", async () => {
        const req = mockRequest({params: {id: 1}});
        const res = mockResponse();
        
        await this.userController.getUser(req, res);

        res.render.getCall(0).args[0].should.equal('profile');
        res.render.getCall(0).args[1].userData.name.should.equal("admin");
      });

      after(async () => {
        this.ensureAuthenticated.restore();
        this.getUser.restore();
      })
    })

    context('# [瀏覽編輯 Profile 頁面]', () => {
      before(() => {
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1});
        this.UserMock = dbMock.define('User', {
          id: 1,
          email: 'root@example.com',
          name: 'admin',
          isAdmin: false,
        });

        this.UserMock.findByPk = (id) => this.UserMock.findOne({where: {id: id}});
        
        this.userController = proxyquire('../../controllers/userController', {
          '../models': { User: this.UserMock }
        }); 
      })

      it(" GET /users/:id/edit ", async () => {
        const req = mockRequest({params: {id: 1}});
        const res = mockResponse();
        
        await this.userController.editUser(req, res);

        res.render.getCall(0).args[0].should.equal('edit');
        res.render.getCall(0).args[1].user.name.should.equal("admin");
      });

      after(async () => {
        this.ensureAuthenticated.restore();
        this.getUser.restore();
      })
    })

    context('# [編輯 Profile]', () => {
      before(async() => {
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1});
        this.UserMock = dbMock.define('User', {
          id: 1,
          email: 'root@example.com',
          name: 'admin',
          isAdmin: false,
        }, {
          instanceMethods: {
            update: (changes) => {
              this.UserMock._defaults = {...changes};
              return Promise.resolve();
            }
          }
        });

        this.UserMock.findByPk = (id) => this.UserMock.findOne({where: {id: id}});
        
        this.userController = proxyquire('../../controllers/userController', {
          '../models': { User: this.UserMock }
        });
      })

      it(" PUT /users/:id ", async () => {
        const req = mockRequest({
          params: {id: 1},
          body: {name: "admin2", email: "admin_test@gmail.com"}
        });
        const res = mockResponse();
        
        await this.userController.putUser(req, res);

        req.flash.calledWith('success_messages', 'user was updated successfully').should.be.true;
        res.redirect.calledWith('/users/1').should.be.true;

        const user = await this.UserMock.findOne({where: {id: 1}});
        user.name.should.equal('admin2');
        user.email.should.equal('admin_test@gmail.com');
      });

      after(async () => {
        this.ensureAuthenticated.restore();
        this.getUser.restore();
      })
    })
  })
})