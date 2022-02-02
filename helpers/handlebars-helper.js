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

const ifCond = (selectedOption, currentOption, options) => {
  return selectedOption === currentOption ? options.fn(this) : options.inverse(this)
}

exports = module.exports = {
  currentYear,
  permissionType,
  defaultNavOption,
  ifCond
}
