const unduplicatedRest = comments => {
  const target = comments.filter(function (comment, index) {
    for (let i = index + 1; i < comments.length; i++) {
      if (comment.Restaurant.id === comments[i].Restaurant.id) return null
    }
    return comment
  })
  return target
}
module.exports = { unduplicatedRest }
