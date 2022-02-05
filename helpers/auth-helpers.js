
/**
 * @param {Object} req
 * @return {Object}
 */
function getUser (req) {
  return req.user || null
}

/**
 * @param {Object} req
 * @return {Number}
 */
function getUserId (req) {
  return getUser(req).id
}

/**
 * @param {Object} req
 * @return {Boolean}
 */
function ensureAuthenticated (req) {
  return req.isAuthenticated()
}

exports = module.exports = {
  getUser,
  getUserId,
  ensureAuthenticated
}
