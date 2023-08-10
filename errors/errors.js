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

class FavoriteError extends Error {
  constructor (message) {
    super(message)
    this.name = 'FavoriteError'
  }
}

class LikeError extends Error {
  constructor (message) {
    super(message)
    this.name = 'LikedError'
  }
}
module.exports = {
  RegisterError,
  UserCRUDError,
  AdminError,
  AdminCategoryError,
  RestaurantError,
  CommentError,
  FavoriteError,
  LikeError
}
