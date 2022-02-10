const unduplicatedRest = comments => {
  const target = [...new Set(comments)] || comments.filter(function (comment, index, self) {
    return self.indexOf(comment) === index
  })
  return target
}
module.exports = { unduplicatedRest }
