const isAttached = (entryId, manyModel, foreignKey) => {
  // Check if a one (entry) to many (Model) relationship data has at least one attached entry. The foreignKey must be provided for checking.
  const where = {}
  where[foreignKey] = entryId
  return new Promise((resolve, reject) => {
    manyModel
      .findOne({ where })
      .then(data => {
        if (!data) return resolve(false)
        return resolve(true)
      })
      .catch(err => reject(err))
  })
}

module.exports = { isAttached }
