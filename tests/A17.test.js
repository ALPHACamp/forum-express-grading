const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()
const SequelizeMock = require('sequelize-mock')
const proxyquire = require('proxyquire')

const dbMock = new SequelizeMock()

const app = require('../../app')
const { classToInvokable } = require('sequelize/types/lib/utils')

const mockRequest = (query) => {
  return {
    ...query,
    flash: sinon.spy(),
  }
}
const mockResponse = () => {
  return {
    redirect: sinon.spy(),
  }
}

describe('# A17', () => {
  describe('登入測試: POST /signin', function(){
    // 以下測試會發出請求，測試資料庫內是否有作業指定的使用者資料
    // 測試資料的來源是真實的資料庫
    it('#1 密碼錯誤', function(done){
      request(app)
        // 對 POST /signin 發出請求，參數是錯誤的密碼
        .post('/signin')
        .type('urlencoded')
        .send('email=root@example.com&password=123')
        // 期待登入驗證回應失敗，重新導向 /signin
        .expect('Location', '/signin')
        .expect(302, done)
    })

    it('#2 帳號錯誤', function(done){
      request(app)
        // 對 POST /signin 發出請求，參數是錯誤的帳號
        .post('/signin')
        .type('urlencoded')
        .send('email=tu&password=12345678')
        // 期待登入驗證回應失敗，重新導向 /signin
        .expect('Location', '/signin')
        .expect(302, done)
    })

    it('#3 成功登入', function(done){
      request(app)
        // 對 POST /signin 發出請求，參數是作業指定的使用者帳號密碼
        .post('/signin')
        .type('urlencoded')
        .send('email=root@example.com&password=12345678')
        // 期待登入驗證成功，重新導向 /restaurants 
        .expect('Location', '/restaurants')
        .expect(302, done)
    })
  });

  describe('# A17: 使用者權限管理', function () {
    before(() => {
      // 製作假資料
      // 下個 context 會用這筆資料進行測試
      this.UserMock = dbMock.define('User', {
        id: 1,
        email: 'root@example.com',
        name: 'admin',
        isAdmin: false,
      })
      // 模擬 Sequelize 行為
      // 將 mock user db 中的 findByPK 用 findOne 取代 (sequelize mock not support findByPK)
      this.UserMock.findByPk = (id) =>
        this.UserMock.findOne({ where: { id: id } })
      // 將 adminController 中的 User db 取代成 User mock db
      this.adminController = proxyquire('../../controllers/adminController', {
        '../models': { User: this.UserMock },
      })
    })

    context('# [顯示使用者清單]', () => {
      it(' GET /admin/users ', async () => {
        // 模擬 request & response
        const req = mockRequest() // 對 GET /admin/users 發出請求
        const res = mockResponse()

        // 測試作業指定的 adminController.getUsers 函式
        await this.adminController.getUsers(req, res)

        // getUser 執行完畢後，應呼叫 res.render
        // res.render 的第 2 個參數應是 users
        // 根據測試資料，users 中的第 1 筆資料，name 屬性值應該要是 'admin'
        res.render.getCall(0).args[1].users[0].name.should.equal('admin')
      })
    })

    context('# [修改使用者權限] for admin', () => {
      before(() => {
      // 製作假資料
      // 本 context 會用這筆資料進行測試
        this.UserMock = dbMock.define('User', {
          id: 1,
          email: 'root@example.com',
          name: 'admin',
          isAdmin: true, // 是管理者
        })
        // 模擬 Sequelize 行為
        // 將 mock user db 中的 findByPK 用 findOne 取代 (sequelize mock not support findByPK)
        // 將 count 的 function 預設回傳假資料數目 1
        this.UserMock.count = () => 1
        this.UserMock.findByPk = (id) =>
          this.UserMock.findOne({ where: { id: id } })
        // 將 adminController 中的 User db 取代成 User mock db
        this.adminController = proxyquire('../../controllers/adminController', {
          '../models': { User: this.UserMock },
        })
      })

      it(' PUT /admin/users/:id/toggleAdmin ', async () => {
        // 模擬 request & response
        const req = mockRequest({ params: { id: 1 } }) // 帶入 params.id = 1，對 PUT /admin/users/1/toggleAdmin 發出請求
        const res = mockResponse()

       // 測試作業指定的 adminController.toggleAdmin 函式
        await this.adminController.toggleAdmin(req, res)

        // toggleAdmin 正確執行的話，應呼叫 req.flash
        // req.flash 的參數應該要與下列字串一致
        req.flash.calledWith('error_messages','禁止變更管理者權限').should.be.true

        // toggleAdmin 執行完畢後，應呼叫 res.redirect 並重新導向上一頁 
        res.redirect.calledWith('back').should.be.true
      })
    })

    context('# [修改使用者權限] for user', () => {
      before(() => {
      // 製作假資料
      // 本 context 會用這筆資料進行測試
        this.UserMock = dbMock.define(
          'User',
          {
            id: 1,
            email: 'user@example.com',
            name: 'user',
            isAdmin: false, // 非管理者
          },
          {
            instanceMethods: {
               // 模擬一個會改變 admin 權限的函式
              update: (changes) => {
                this.UserMock._defaults = { ...changes }
                return Promise.resolve()
              },
            },
          }
        )
        // 模擬 Sequelize 行為
        this.UserMock.count = () => 1
        this.UserMock.findByPk = (id) =>
          this.UserMock.findOne({ where: { id: id } })

        this.adminController = proxyquire('../../controllers/adminController', {
          '../models': { User: this.UserMock },
        })
      })

      it(' PUT /admin/users/:id/toggleAdmin ', async (done) => {
        // 模擬 request & response
        const req = mockRequest({ params: { id: 1 } }) // 帶入 params.id = 1，對 PUT /admin/users/1/toggleAdmin 發出請求
        const res = mockResponse()

        // 測試作業指定的 adminController.toggleAdmin 函式
        await this.adminController.toggleAdmin(req, res)

        // toggleAdmin 正確執行的話，應呼叫 req.flash 
        // req.flash 的參數應與下列字串一致
        req.flash.calledWith('success_messages','使用者權限變更成功').should.be.true
        // toggleAdmin 執行完畢後，應呼叫 res.redirect 並重新導向 /admin/users
        res.redirect.calledWith('/admin/users').should.be.true

        // toggleAmin 執行完畢後，假資料中 id:1 使用者的應該要是 isAdmin：true
        // 將假資料撈出，比對確認有成功修改到
        const user = await this.UserMock.findOne({ where: { id: 1 } })
        user.isAdmin.should.equal(true)

        done()
      })
    })
  })
})
