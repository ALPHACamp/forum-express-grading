module.exports = {
  removesWhitespace: obj => {
    // 遍歷傳入的 obj，將val前後的空白移除 or val本身為空白則回傳undefined
    // 回傳值為新的 obj
    return Object.fromEntries(Object.entries(obj).map(([key, val]) => {
      return (val) ? [key, val.trim()] : [key, undefined] // 資料庫欄位為undefined將會採用預設值（name: '未命名'）
    }))
  },
  nullCategoryHandle: data => {
    if (typeof data !== 'object') return data
    return (data.length)
      ? data.map(el => ({
        ...el,
        categoryId: el.categoryId || 0,
        Category: {
          ...el.Category,
          name: el.Category.name || '未分類'
        }
      }))
      : {
          ...data,
          categoryId: data.categoryId || 0,
          Category: {
            ...data.Category,
            name: data.Category.name || '未分類'
          }
        }
  },
  descriptionCut: arr => {
    const stringLimit = 40
    if (!arr.length) return arr
    return arr.map(el => {
      if (el.description) {
        return (el.description.length >= stringLimit) ? { ...el, description: el.description.substring(0, stringLimit) + '...' } : { ...el }
      } else if (el.text) {
        return (el.text.length >= stringLimit) ? { ...el, text: el.text.substring(0, stringLimit) + '...' } : { ...el }
      } else {
        return el
      }
    })
  }
}
