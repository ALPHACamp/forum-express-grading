const uniqBy = (a, key) => {
  // 這個function可以自訂finction傳入key
  // 藉由key的條件取出a中的特徵
  // 依照特徵決定a中的值是否重複
  const seen = new Set()
  return a.filter(item => {
    const k = key(item)
    return seen.has(k) ? false : seen.add(k)
  })
}

/* 找出所有評論過餐廳
   並去除重複的
*/
const getCommentedRests = targetUser => {
  if (targetUser.Comments) { // 有Comment才回傳，不然回傳空array
    return uniqBy(
      targetUser.Comments // 用set 去除相同的restaurant
        .filter(comment => comment.Restaurant) // 如果restaurant不明原因不見，會撈到null，先filter null
        .map(comment => {
          return comment.Restaurant.toJSON()
        }),
      restaurant => restaurant.id
    )
  } else {
    return []
  }
}

module.exports = { uniqBy, getCommentedRests }
