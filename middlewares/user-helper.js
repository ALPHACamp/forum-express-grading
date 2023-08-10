const { UserCRUDError } = require('../errors/errors')
const { getUser } = require('../helpers/auth-helpers')
const blockEditFromOtherUser = (req, res, next) => {
  try {
  // 此helper防止user資訊被其他帳號更新
    const loginUser = getUser(req)
    const paramId = parseInt(req.params.id)
    if (isNaN(paramId)) throw new UserCRUDError('User Profie ID Parse Error') // 如果parseInt回傳
    if (!loginUser) throw new UserCRUDError('Pleas login')
    if (loginUser.id !== paramId) throw new UserCRUDError('Editting other\'s profie is not allowed')
    return next()
  } catch (error) {
    return next(error)
  }
}

module.exports = { blockEditFromOtherUser }
