const dayjs = require('dayjs')

const currentYear = () => {
  return dayjs().year()
}

const permissionType = isAdmin => {
  return isAdmin ? 'admin' : 'user'
}

const defaultNavOption = (selectedType, currentType) => {
  return selectedType === currentType ? 'active' : ''
}

exports = module.exports = {
  currentYear,
  permissionType,
  defaultNavOption
}
