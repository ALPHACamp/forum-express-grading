const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
// the reason to use dayjs is because original format of JavaScript Date object is a bit mess
// if using original JavaScript data object, we need to do some data formating
// dayjs helps us do the cleansing, it is why we use this package here

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
