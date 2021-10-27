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

// 模擬 Like 資料
let mockLikeData = [
  {
    UserId: 1,
    RestaurantId: 2,
  },
]

describe('# A21: Like / Unlike', function () {
  context('# Q1: 使用者可以 Like 餐廳', () => {
    before(() => {
      // 模擬驗證資料
      this.ensureAuthenticated = sinon
        .stub(helpers, 'ensureAuthenticated')
        .returns(true)
      this.getUser = sinon.stub(helpers, 'getUser').returns({ id: 1 })

      //
      this.mockLikeData = []
      this.likeMock = dbMock.define('Like')
      // 因為 mock 中的 create 有問題，因此指向 upsert function, 這樣可以在 useHandler 中取得 create 呼叫
      this.likeMock.create = this.likeMock.upsert

      // 模擬 Like.create and Like.finall 的 function
      this.likeMock.$queryInterface.$useHandler((query, queryOptions, done) => {
        if (query === 'upsert') {
          // create 時會帶 UserId 跟 RestaurantId (ex: Like.create({ UserId: 1, RestaurantId: 2}))
          const { UserId, RestaurantId } = queryOptions[0]

          // 新增這個 Like 的資訊到模擬資料裡
          this.mockLikeData.push({ UserId, RestaurantId })

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
      const req = mockRequest({ params: { id: 1, restaurantId: 2 } })
      const res = mockResponse()

      // 呼叫 userController 中的 addLike
      await this.userController.addLike(req, res)

      const likes = await this.likeMock.findAll()
      // 確認呼叫 addLike 後，模擬資料中的 like 資料會多一個
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
      // 模擬驗證資料
      this.ensureAuthenticated = sinon
        .stub(helpers, 'ensureAuthenticated')
        .returns(true)
      this.getUser = sinon.stub(helpers, 'getUser').returns({ id: 1 })
      // 模擬 Like db 資料
      this.likeMock = dbMock.define('Like', {
        id: 1,
        UserId: 1,
        RestaurantId: 2,
      })
      // 模擬 Like.destroy and Like.finall 的 function
      this.likeMock.$queryInterface.$useHandler((query, queryOptions, done) => {
        if (query === 'destroy') {
          const { UserId, RestaurantId } = queryOptions[0].where
          // destroy 可以從 where 取得要刪除的資料
          // 因此就可以模擬將模擬資料中的資料刪除
          mockLikeData = mockLikeData.filter(
            (d) => !(d.UserId === UserId && d.RestaurantId === RestaurantId)
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
      // 模擬發出 request, 帶入 params.id = 1, restaurantId = 2
      const req = mockRequest({ params: { id: 1, restaurantId: 2 } })
      const res = mockResponse()

      // call DELETE /like/:restaurantId route 對應的 userController.removeLike
      await this.userController.removeLike(req, res)

      // 刪除後，模擬資料會是空的
      const likes = await this.likeMock.findAll()
      likes.should.have.lengthOf(0)
    })

    after(async () => {
      // 清除模擬驗證資料
      this.ensureAuthenticated.restore()
      this.getUser.restore()
    })
  })
})
