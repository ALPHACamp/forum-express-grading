const moment = require('moment')

module.exports = {
  isSelected: function (v1, v2) {
    return v1 === v2
  },

  moment: function (time) {
    return moment(time).fromNow()
  }
}