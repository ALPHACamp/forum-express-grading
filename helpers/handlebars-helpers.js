const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  isRoot: email => (email === 'root@example.com') ? 'disabled' : null
}
