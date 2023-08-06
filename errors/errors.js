class RegisterError extends Error {
  constructor (message) {
    super(message)
    this.name = 'RegisterError'
  }
}

class UserCRUDError extends Error {
  constructor (message) {
    super(message)
    this.name = 'UserCRUDError'
  }
}

class AdminError extends Error {
  constructor (message) {
    super(message)
    this.name = 'AdminError'
  }
}

class AdminCategoryError extends Error {
  constructor (message) {
    super(message)
    this.name = 'AdminCategoryError'
  }
}

class RestaurantError extends Error {
  constructor (message) {
    super(message)
    this.name = 'RestaurantError'
  }
}

class CommentError extends Error {
  constructor (message) {
    super(message)
    this.name = 'CommentError'
  }
}

module.exports = {
  RegisterError,
  UserCRUDError,
  AdminError,
  AdminCategoryError,
  RestaurantError,
  CommentError
}
