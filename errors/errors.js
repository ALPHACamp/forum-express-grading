class RegisterError extends Error {
  constructor (message) {
    super(message)
    this.name = 'RegisterError'
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
module.exports = {
  RegisterError,
  AdminError,
  AdminCategoryError,
  RestaurantError
}
