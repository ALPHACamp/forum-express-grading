const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const db = require('../models')
const helpers = require('../_helpers')
const SequelizeMock = require('sequelize-mock')
const proxyquire = require('proxyquire')

const dbMock = new SequelizeMock({ autoQueryFallback: false })

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

// 建立模擬的 Like 資料
let mockLikeData = [
  {
    userId: 1,
    restaurantId: 2,
  },
]

describe('# A21: Like / Unlike', function () {
  context('# Q1: 使用者可以 Like 餐廳', () => {
    before(() => {
      // 模擬登入驗證
      this.ensureAuthenticated = sinon
        .stub(helpers, 'ensureAuthenticated')
        .returns(true)
      this.getUser = sinon.stub(helpers, 'getUser').returns({ id: 1 })

      // 建立了一個模擬的 Like table，裡面目前是空的
      // 模擬 Sequelize 行為
      this.mockLikeData = []
      this.likeMock = dbMock.define('Like')
      // 因為 mock 中的 create 有問題，因此指向 upsert function, 這樣可以在 useHandler 中取得 create 呼叫
      this.likeMock.create = this.likeMock.upsert

      // 模擬 Like.create and Like.findall 的 function
      this.likeMock.$queryInterface.$useHandler((query, queryOptions, done) => {
        if (query === 'upsert') {
          // create 時會帶 userId 跟 restaurantId (ex: Like.create({ userId: 1, restaurantId: 2}))
          const { userId, restaurantId } = queryOptions[0]

          // 新增這個 Like 的資訊到模擬資料裡
          this.mockLikeData.push({ userId, restaurantId })

          // 回傳模擬資料
          return Promise.resolve(this.likeMock.build(this.mockLikeData))
        } else if (query === 'findAll') {
          // 回傳模擬資料
          return Promise.resolve(this.mockLikeData)
        }
      })

      this.userController = proxyquire('../controllers/userController', {
        '../models': { Like: this.likeMock },
      })
    })

    it(' POST /like/:restaurantId ', async () => {
      // 模擬 request & response
      const req = mockRequest({ params: { id: 1, restaurantId: 2 } }) // 帶入 params.id = 1，對 POST /like/2 發出請求
      const res = mockResponse()

      // 測試 userController.addLike 函式
      await this.userController.addLike(req, res)
      // 將模擬的 Like table 內的資料全數撈出
      const likes = await this.likeMock.findAll()
      // addLike 執行完畢後，Like table 應會從空的 -> 變成有 1 筆資料
      likes.should.have.lengthOf(1)
    })

    after(async () => {
      // 清除驗證資料
      this.ensureAuthenticated.restore()
      this.getUser.restore()
    })
  })

  context('# Q1: 使用者可以 unLike 餐廳', () => {
    before(() => {
      // 模擬登入驗證
      this.ensureAuthenticated = sinon
        .stub(helpers, 'ensureAuthenticated')
        .returns(true)
      this.getUser = sinon.stub(helpers, 'getUser').returns({ id: 1 })
      // 製作假資料
      // 下個 context 會用這筆資料進行測試
      // 模擬 Like table 裡目前有 1 筆資料如下
      this.likeMock = dbMock.define('Like', {
        id: 1,
        userId: 1,
        restaurantId: 2,
      })
      // 模擬 Sequelize 行為
      // 模擬 Like.destroy and Like.finall 的 function
      this.likeMock.$queryInterface.$useHandler((query, queryOptions, done) => {
        if (query === 'destroy') {
          const { userId, restaurantId } = queryOptions[0].where
          // destroy 可以從 where 取得要刪除的資料
          // 因此就可以模擬將模擬資料中的資料刪除
          mockLikeData = mockLikeData.filter(
            (d) => !(d.userId === userId && d.restaurantId === restaurantId)
          )

          return Promise.resolve(this.likeMock.build(mockLikeData))
        } else if (query === 'findAll') {
          return Promise.resolve(mockLikeData)
        }
      })

      this.userController = proxyquire('../controllers/userController', {
        '../models': { Like: this.likeMock },
      })
    })

    it(' DELETE /like/:restaurantId ', async () => {
      // 模擬 request & response
      // 模擬發出 request, 帶入 params.id = 1, restaurantId = 2
      const req = mockRequest({ params: { id: 1, restaurantId: 2 } }) // 帶入 params.id = 1，對 DELETE /like/2 發出請求
      const res = mockResponse()

      // 測試作業指定的 userController.removeLike 函式
      await this.userController.removeLike(req, res)

      // 將模擬的 Like table 內的資料全數撈出
      const likes = await this.likeMock.findAll()
      // addLike 執行完畢後，Like table 應會從有 1 筆資料 -> 變成空的
      likes.should.have.lengthOf(0)
    })

    after(async () => {
      // 清除模擬驗證資料
      this.ensureAuthenticated.restore()
      this.getUser.restore()
    })
  })
})
