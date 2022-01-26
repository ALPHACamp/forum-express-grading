const transAuthBtns = document.querySelectorAll(".trans-auth")

transAuthBtns.forEach(transAuthBtn => {
  transAuthBtn.addEventListener('click', async event => {
    console.log("got click")
    event.stopPropagation()
    event.preventDefault()
    let result = null

    if (transAuthBtn.dataset.self) {
      result = await Swal.fire({
        title: '你要確定餒',
        text: "確定要調降自己的權限？",
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
