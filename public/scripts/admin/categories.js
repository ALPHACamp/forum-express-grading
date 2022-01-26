const deleteBtns = document.querySelectorAll('.link-danger')

deleteBtns.forEach(deleteBtn => {
  deleteBtn.addEventListener('click', async event => {
    try {
      event.stopPropagation()
      event.preventDefault()
      const categoryId = deleteBtn.dataset.id

      // eslint-disable-next-line no-undef
      const res = await axios.get(`/admin/categories/check-attachment/${categoryId}`)

      // If category is attached, ask user how to erase/replace data
      if (res.data) {
        const { value: option } = await Swal.fire({
          title: '此類別已有對應餐廳資料，您可以選擇',
          input: 'select',
          inputOptions: {
            deleteAll: '刪除全部餐廳資料',
            replace: "以'（未分類）'取代類別"
          },
          inputPlaceholder: '請選擇刪除方式',
          showCancelButton: true,
          inputValidator: value => {
            return new Promise((resolve, reject) => {
              if (!value) return resolve('請選擇一種刪除方式')
              // Pass option to the outside
              resolve()
            })
          }
        })

        // Send delete request
        await axios({
          method: 'post',
          url: `/admin/categories/${categoryId}?_method=DELETE&option=${option}`
        })
        // Refresh current page
        location.reload()
      } else {
        return deleteBtn.parentElement.submit()
      }
    } catch (error) {
      console.error(error)
    }
  })
})
