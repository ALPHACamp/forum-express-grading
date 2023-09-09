const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  activeRestaurantsTab: currentPage => currentPage === 'restaurants' ? 'active' : '',
  activeUsersTab: currentPage => currentPage === 'users' ? 'active' : '',
  userRole: isAdmin => isAdmin ? 'admin' : 'user',
  becomeRole: isAdmin => isAdmin ? 'set as user' : 'set as admin'
}
