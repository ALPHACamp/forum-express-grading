const dayjs = require('dayjs') // invoke dayjs
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
module.exports = {
  currentYear: () => dayjs().year(), // get current year and export
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifEq: function (a, b, option) {
    return a === b ? option.fn(this) : option.inverse(this)
  }

}
