const getUser = req => {
  return req.user || null
}
module.exports = { getUser }

// same as above
// module.exports = {
//   getUser: req => {
//     return req.user || null
//   }
// }
