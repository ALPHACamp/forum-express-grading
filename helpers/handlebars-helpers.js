const dayjs = require('dayjs')
module.exports = {
    currentYear: () => dayjs().year(),

    ifCond: (a, b, options) => {
        return a === b ? options.fn(this) : options.inverse(this)
    }
}
