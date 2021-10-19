const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()
const SequelizeMock = require('sequelize-mock');
const proxyquire = require('proxyquire');

const dbMock = new SequelizeMock();

const app = require('../../app');
const { classToInvokable } = require('sequelize/types/lib/utils');

const mockRequest = (query) => {
  return {
    ...query,
    flash: sinon.spy() 
  };
};
const mockResponse = () => {
  return {
    redirect: sinon.spy()
  }
};

describe('# A17', () => {
  describe('登入測試: POST /signin', function(){
    // 以下測試會發出真實的 request 測試資料庫是否有正確的 user 資料
    it('#1 密碼錯誤', function(done){
      request(app)
        .post('/signin')
        .type('urlencoded')
        .send('email=root@example.com&password=123')
        .expect('Location', '/signin')
        .expect(302, done)
    })

    it('#2 帳號錯誤', function(done){
      request(app)
        .post('/signin')
        .type('urlencoded')
        .send('email=tu&password=12345678')
        .expect('Location', '/signin')
        .expect(302, done)
    })

    it('#3 成功登入', function(done){
      request(app)
        .post('/signin')
        .type('urlencoded')
        .send('email=root@example.com&password=12345678')
        .expect('Location', '/restaurants')
        .expect(302, done)
    })
  });

  describe('# A17: 使用者權限管理', function () {
    before(() => {
      // 製作假 db 資料: UserMock
      this.UserMock = dbMock.define('User', {
        id: 1,
        email: 'root@example.com',
        name: 'admin',
        isAdmin: false,
      });
      // 將 mock user db 中的 findByPK 用 findOne 取代 (sequelize mock not support findByPK)
      this.UserMock.findByPk = (id) => this.UserMock.findOne({where: {id: id}});
      // 將 adminController 中的 User db 取代成 User mock db
      this.adminController = proxyquire('../../controllers/adminController', {
        '../models': { User: this.UserMock }
      }); 
    })
    
    context('# [顯示使用者清單]', () => {
      it(" GET /admin/users ", async () => {
        // 模擬 request & response
        const req = mockRequest();
        const res = mockResponse();

        // 測試 adminController.getUsers function
        await this.adminController.getUsers(req, res);

        // render 裡的第二個參數，回傳了 users, 名稱必須跟假資料一樣是 admin
        res.render.getCall(0).args[1].users[0].name.should.equal('admin');
      });
    })
  
    context('# [修改使用者權限] for admin', () => {
      before(() => {
        // 模擬 user db 資料: UserMock
        this.UserMock = dbMock.define('User', {
          id: 1,
          email: 'root@example.com',
          name: 'admin',
          isAdmin: true,
        });
        // 將 mock user db 中的 findByPK 用 findOne 取代 (sequelize mock not support findByPK)
        // 將 count 的 function 預設回傳假資料數目 1
        this.UserMock.count = () => 1;
        this.UserMock.findByPk = (id) => this.UserMock.findOne({where: {id: id}});
        // 將 adminController 中的 User db 取代成 User mock db 
        this.adminController = proxyquire('../../controllers/adminController', {
          '../models': { User: this.UserMock }
        }); 
      })

      it(" PUT /admin/users/:id/toggleAdmin ", async () => {
        const req = mockRequest({params: {id: 1}});
        const res = mockResponse();

        // 測試 adminController.toggleAdmin function
        await this.adminController.toggleAdmin(req, res);

        // 執行完 toggleAdmin 後，res.flash 有被呼叫而且呼叫的訊息正確
        req.flash.calledWith('error_messages', 'core manager can not be changed').should.be.true;
        // 執行完 toggleAmin 後 res.redirect 有被呼叫而且 redirect 到 back
        res.redirect.calledWith('back').should.be.true;
      });
    })

    context('# [修改使用者權限] for user', () => {
      before(() => {
        this.UserMock = dbMock.define('User', {
          id: 1,
          email: 'user@example.com',
          name: 'user',
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

        this.UserMock.count = () => 1;
        this.UserMock.findByPk = (id) => this.UserMock.findOne({where: {id: id}});
        
        this.adminController = proxyquire('../../controllers/adminController', {
          '../models': { User: this.UserMock }
        }); 
      })

      it(" PUT /admin/users/:id/toggleAdmin ", async (done) => {
        const req = mockRequest({params: {id: 1}});
        const res = mockResponse();

        await this.adminController.toggleAdmin(req, res);

        req.flash.calledWith('success_messages', 'user was successfully to update').should.be.true;
        res.redirect.calledWith('/admin/users').should.be.true;

        // 執行完 toggleAmin 後，因為假資料中使用者是 user@example.com，因此可以修改權限 isAdmin 從 false -> true
        // 所以這邊將假資料撈出，比對看是否有修改到
        const user = await this.UserMock.findOne({where: {id: 1}});
        user.isAdmin.should.equal(true);

        done()
      });
    })
  })
})