const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()
const SequelizeMock = require('sequelize-mock');
const proxyquire = require('proxyquire');

const dbMock = new SequelizeMock();

const app = require('../app');

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
    it('should fail without proper username', function(done){
      request(app)
        .post('/signin')
        .type('urlencoded')
        .send('email=root@example.com&password=123')
        .expect('Location', '/signin')
        .expect(302, done)
    })

    it('should fail without proper password', function(done){
      request(app)
        .post('/signin')
        .type('urlencoded')
        .send('email=tu&password=12345678')
        .expect('Location', '/signin')
        .expect(302, done)
    })

    it('should succeed with proper credentials', function(done){
      request(app)
        .post('/signin')
        .type('urlencoded')
        .send('email=root@example.com&password=12345678')
        .expect('Location', '/')
        .expect(302, done)
    })
  });

  describe('# A17: 使用者權限管理', function () {
    before(() => {
      this.UserMock = dbMock.define('User', {
        id: 1,
        email: 'root@example.com',
        name: 'admin',
        isAdmin: false,
      });
      
      this.adminController = proxyquire('../controllers/adminController', {
        '../models': { User: this.UserMock }
      }); 
    })
    
    context('# [顯示使用者清單]', () => {
      it(" GET /admin/users ", (done) => {
        const req = {}
        const res = {
          render: (_, results) => {
            results.users[0].name.should.equal("admin");
            done()
          }
        };

        this.adminController.getUsers(req, res);
      });
    })
  
    context('# [修改使用者權限] for admin', () => {
      before(() => {
        this.UserMock = dbMock.define('User', {
          id: 1,
          email: 'root@example.com',
          name: 'admin',
          isAdmin: false,
        });
        
        this.adminController = proxyquire('../controllers/adminController', {
          '../models': { User: this.UserMock }
        }); 
      })

      it(" PUT /admin/users/:id/toggleAdmin ", async () => {
        const req = mockRequest({params: {id: 1}});
        const res = mockResponse();

        await this.adminController.toggleAdmin(req, res);

        req.flash.calledWith('error_messages', 'core manager can not be changed').should.be.true;
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
            update: (changes) => {
              this.UserMock._defaults = {...changes};
              return Promise.resolve();
            }
          }
        });
        
        this.adminController = proxyquire('../controllers/adminController', {
          '../models': { User: this.UserMock }
        }); 
      })

      it(" PUT /admin/users/:id/toggleAdmin ", async () => {
        const req = mockRequest({params: {id: 1}});
        const res = mockResponse();

        await this.adminController.toggleAdmin(req, res);

        req.flash.calledWith('success_messages', 'user was successfully to update').should.be.true;
        res.redirect.calledWith('/admin/users').should.be.true;

        const user = await this.UserMock.findOne({where: {id: 1}});
        user.isAdmin.should.equal(true);
      });
    })
  })
})