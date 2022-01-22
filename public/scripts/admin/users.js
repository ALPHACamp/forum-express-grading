/* eslint-disable no-undef */
const userToggles = document.querySelectorAll('.user-auth-change')

userToggles.forEach(userToggle => {
  userToggle.addEventListener('click', async event => {
    event.stopPropagation()
    event.preventDefault()

    // If user try to cancel it's admin access, give it a warning
    let toggle
    if (userToggle.dataset.self) {
      toggle = await Swal.fire({
        title: '注意',
        text: '您確定要將自己的權限降為使用者嗎？',
        icon: 'warning',
        showCancelButton: true
      })
    } else {
      // eslint-disable-next-line no-undef
      toggle = await Swal.fire({
        title: '注意',
        text: `您確定要更改${userToggle.dataset.name}的權限嗎？`,
        icon: 'warning',
        showCancelButton: true
      })
    }

    if (toggle.isConfirmed) return userToggle.parentElement.submit()
  })
})
