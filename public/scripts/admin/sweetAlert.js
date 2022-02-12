
// 變更使用者權限
const transAuthBtns = document.querySelectorAll('.trans-auth')
transAuthBtns.forEach(transAuthBtn => {
  transAuthBtn.addEventListener('click', async event => {
    event.stopPropagation()
    event.preventDefault()
    let result = null

    if (transAuthBtn.dataset.self) {
      result = await Swal.fire({
        title: '你要確定餒',
        text: '確定要調降自己的權限？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
    } else {
      result = await Swal.fire({
        title: '你要確定餒',
        text: `確定要更改${transAuthBtn.dataset.name}的權限？`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
    }
    if (result.isConfirmed) return transAuthBtn.parentElement.submit()
  })
})

// 刪除類別
const deleteCategoryBtns = document.querySelectorAll('.delete-category')
deleteCategoryBtns.forEach(deleteCategoryBtn => {
  deleteCategoryBtn.addEventListener('click', async event => {
    event.stopPropagation()
    event.preventDefault()
    let result = null
    if (deleteCategoryBtn.dataset.need) {
      result = await Swal.fire({
        title: '這樣做很嚴重！',
        text: `${deleteCategoryBtn.dataset.name}為被使用中的類別，刪除將會導致該類別的餐廳沒有分類`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, who cares!'
      })
    } else {
      result = await Swal.fire({
        title: '你要確定餒',
        text: `確定要刪除${deleteCategoryBtn.dataset.name}這個類別？`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
    }
    if (result.isConfirmed) return deleteCategoryBtn.parentElement.submit()
  })
})

// 刪除評論
const deleteCommentBtns = document.querySelectorAll('.delete-comment')
deleteCommentBtns.forEach(deleteCommentBtn => {
  deleteCommentBtn.addEventListener('click', async event => {
    event.stopPropagation()
    event.preventDefault()
    let result = null
    result = await Swal.fire({
      title: '你要確定餒',
      text: '確定要刪除這個評論？',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
    if (result.isConfirmed) return deleteCommentBtn.parentElement.submit()
  })
})
