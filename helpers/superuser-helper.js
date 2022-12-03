const superuser = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

module.exports = {
  isSuperuser: email => email === superuser.email
}
