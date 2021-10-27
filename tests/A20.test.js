const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const helpers = require('../_helpers')
const SequelizeMock = require('sequelize-mock')
const proxyquire = require('proxyquire')

const dbMock = new SequelizeMock()

const mockRequest = (query) => {
  return {
    ...query,
    flash: sinon.spy(),
  }
}
const mockResponse = () => {
  return {
    redirect: sinon.spy(),
    render: sinon.spy(),
  }
}

describe('# A20: 餐廳資訊整理：Dashboard', function () {
  context('# [Q1: Dashboard - 1 - controller / view / route]', () => {
    before(async () => {
      // 製作假資料
      // 本 context 會用這筆資料進行測試
      this.UserMock = dbMock.define('User', {
        id: 1,
        email: 'root@example.com',
        name: 'admin',
        isAdmin: false,
      })
      this.RestaurantMock = dbMock.define('Restaurant', {
        id: 1,
        name: '銷魂麵',
      })
      this.CategoryMock = dbMock.define('Category', {
        id: 1,
        name: '食物',
      })
      this.CommentMock = dbMock.define('Comment', {
        id: 1,
        text: 'gogogo',
      })
      // 模擬 Sequelize 行為
      // 將 mock user db 中的 findByPK 用 findOne 取代 (sequelize mock not support findByPK)
      this.RestaurantMock.findByPk = (id) =>
        this.RestaurantMock.findOne({ where: { id: id } })
      // 將 count 的 function 預設回傳假資料數目 1
      this.CommentMock.count = () => 1

      // 將 restController 中的 User,Category,Restaurant,Comment 都用模擬資料取代
      this.restController = proxyquire('../controllers/restController', {
        '../models': {
          User: this.UserMock,
          Category: this.CategoryMock,
          Restaurant: this.RestaurantMock,
          Comment: this.CommentMock,
        },
      })
    })

    it(' GET /restaurants/:id/dashboard ', async () => {
      // 模擬 request & response
      const req = mockRequest({ params: { id: 1 } }) // 帶入 params.id = 1，對 GET /restaurants/1/dashboard 發出請求
      const res = mockResponse()
      // 測試 restController.getDashBoard 函式
      await this.restController.getDashBoard(req, res)

      // getDashBoard 執行完畢後，應呼叫 res.render
      // res.render 的第 1 個參數要是 'dashboard'
      // res.render 的第 2 個參數要包含 restaurant，其 name 屬性的值應是 '銷魂麵'
      res.render.getCall(0).args[0].should.equal('dashboard')
      res.render.getCall(0).args[1].restaurant.name.should.equal('銷魂麵')
      res.render.getCall(0).args[1].n_comments.should.equal(1) // question**
    })
  })
})
