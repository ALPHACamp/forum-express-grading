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
        // 模擬驗證資料
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1});
        // 模擬 User db 資料
        this.UserMock = dbMock.define('User', {
          id: 1,
          email: 'root@example.com',
          name: 'admin',
          isAdmin: false,
        });
        // 將 mock user db 中的 findByPK 用 findOne 取代 (sequelize mock not support findByPK)
        this.UserMock.findByPk = (id) => this.UserMock.findOne({where: {id: id}});
        // 將 userController 中的 User db 取代成 User mock db
        this.userController = proxyquire('../../controllers/userController', {
          '../models': { User: this.UserMock }
        });
      })

      it(" GET /users/:id ", async () => {
        // 模擬發出 request, 帶入 params.id = 1
        const req = mockRequest({params: {id: 1}});
        const res = mockResponse();

        // 測試 userController.getUser
        await this.userController.getUser(req, res);

        // 執行完後，call res.render 的參數測試
        // 1. 第一個參數是不是 profile
        // 2. 第二個參數裡回傳的資料有 userData 而且 name 是 admin
        res.render.getCall(0).args[0].should.equal('profile');
        res.render.getCall(0).args[1].userData.name.should.equal("admin");
      });

      after(async () => {
        // 清除模擬驗證資料
        this.ensureAuthenticated.restore();
        this.getUser.restore();
      })
    })

    context('# [瀏覽編輯 Profile 頁面]', () => {
      before(() => {
        // 製作假驗證資料
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1});

        // 模擬 User db 資料 
        this.UserMock = dbMock.define('User', {
          id: 1,
          email: 'root@example.com',
          name: 'admin',
          isAdmin: false,
        });
        // 將 mock user db 中的 findByPK 用 findOne 取代 (sequelize mock not support findByPK)
        this.UserMock.findByPk = (id) => this.UserMock.findOne({where: {id: id}});
        
        // 將 userController 中的 User db 取代成 User mock db
        this.userController = proxyquire('../../controllers/userController', {
          '../models': { User: this.UserMock }
        }); 
      })

      it(" GET /users/:id/edit ", async () => {
        // 模擬 request & response
        const req = mockRequest({params: {id: 1}});
        const res = mockResponse();
        
        // 測試 adminController.editUser function
        await this.userController.editUser(req, res);

        // 執行完 editUser 後，call res.render 的參數測試
        // 1. 第一個參數是不是 edit
        // 2. 第二個參數裡回傳的資料有 user 而且 name 是 admin
        res.render.getCall(0).args[0].should.equal('edit');
        res.render.getCall(0).args[1].user.name.should.equal("admin");
      });

      after(async () => {
        // 清除模擬驗證資料
        this.ensureAuthenticated.restore();
        this.getUser.restore();
      })
    })

    context('# [編輯 Profile]', () => {
      before(async() => {
        // 模擬 request & response
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1});
        // 製作假 db 資料: UserMock
        this.UserMock = dbMock.define('User', {
          id: 1,
          email: 'root@example.com',
          name: 'admin',
          isAdmin: false,
        }, {
          instanceMethods: {
            // 模擬 update 函數，並依據傳入的變數，跟著修正，如果傳入 {isAdmin: true}
            update: (changes) => {
              this.UserMock._defaults = {...changes};
              return Promise.resolve();
            }
          }
        });
        // 將 mock user db 中的 findByPK 用 findOne 取代 (sequelize mock not support findByPK)
        this.UserMock.findByPk = (id) => this.UserMock.findOne({where: {id: id}});
        // 將 userController 中的 User db 取代成 User mock db 
        this.userController = proxyquire('../../controllers/userController', {
          '../models': { User: this.UserMock }
        });
      })

      it(" PUT /users/:id ", async () => {
        // 模擬發送 request, 帶了 params.id = 1, body.name = amdin2, body.email = admin_test@gmail.com
        const req = mockRequest({
          params: {id: 1},
          body: {name: "admin2", email: "admin_test@gmail.com"}
        });
        const res = mockResponse();

        // 修改模擬資料, call putUser function
        await this.userController.putUser(req, res);
        
        // 測試成功修改 user 資料後，是否有回傳正確訊息
        req.flash.calledWith('success_messages', 'user was updated successfully').should.be.true;
        // 測試成功修改 user 資料後，是否有導向正確 route
        res.redirect.calledWith('/users/1').should.be.true;
        // 修改後，測試模擬資料中是否有成功修正, name = amdin2, email = admin_test@gmail.com
        const user = await this.UserMock.findOne({where: {id: 1}});
        user.name.should.equal('admin2');
        user.email.should.equal('admin_test@gmail.com');
      });

      after(async () => {
        // 清除模擬驗證資料
        this.ensureAuthenticated.restore();
        this.getUser.restore();
      })
    })
  })
})