 const m = require('moment')
 module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
      }
    return options.inverse(this)
  },
  moment: function(time){
    if(Date.now()-time > 86400000) return m(time).format('MMM Do YY, h:mm a')
    else return m(time).startOf('hour').fromNow()
  }


}