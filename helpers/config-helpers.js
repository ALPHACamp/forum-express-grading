const path = require('path')

function getCurrentConfig () {
  const env = process.env.NODE_ENV || 'development'
  return require(path.resolve(__dirname, '../config/config.json'))[env]
}
const currentConfig = getCurrentConfig()

module.exports = {
  config: currentConfig
}
