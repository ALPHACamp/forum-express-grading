const express = require('express')
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const commentController = require('../controllers/commentController.js')
const categoryController = require('../controllers/categoryController.js')
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const helpers = require('../_helpers.js')
//isAuthenticated => helpers.ensureAuthenticated(req)
//req.user => helpers.getUser(req)

module.exports = (app, passport) => {
  
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req) ) { return next() }
    res.redirect('/signin')}

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) { 
      if (helpers.getUser(req).isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }  
  //router info middleware
  if (process.env.NODE_ENV !== 'production') {
    app.use(function(req, res, next) {
      console.log(`method: ${req.method}, router: ${req.url}`)
      next() 
  })}
  //user login/out
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  //common user
  app.get('/restaurants', authenticated, restController.getRestaurants)  
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)
  app.post('/comments', authenticated, commentController.postComment)
  app.get('/users/:id/edit', authenticated, userController.editUser)          //(generate user page with edit) users can edit their own profile (but not others)
  app.get('/users/:id', authenticated, userController.getUser)                   //(generate user page only)users can view profile from other users
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser) //admin can edit profile of all users
  //admin
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin )
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers )
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment )
  
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  app.get('/admin/restaurants/create', authenticatedAdmin, upload.single('image'),  adminController.createRestaurant) //go to create.hbs  
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)                                   //view all restaurants in admin mode
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)          //create a restaurant
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, upload.single('image'),  adminController.editRestaurant) //go to create.hbs (with previous data show)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)                          //delete a restaurant
  app.post('/admin/restaurants/edit/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)  //send edit restaurant
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

  //homepage redirection
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))

}
