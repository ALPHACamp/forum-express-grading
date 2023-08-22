// 排除id=99 '已刪除的分類'

const deletedCategoryId = 99 // 已刪除的分類 兩個資料都屬於寫死  不用特地再去查一個寫死的資料

const deletedCategoryFilter = records => records.filter(record => record.id !== deletedCategoryId)

module.exports = {
  deletedCategoryFilter,
  deletedCategoryId
}

// module.exports = {
//   deletedFilter: categories => {
//     return Category.findOne({ where: { name: '已刪除的分類' } })
//       .then(deleted => categories.filter(record => record.id !== deleted.id))
//   }
// }
