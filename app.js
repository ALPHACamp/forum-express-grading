const express = require('express')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

console.log('假裝寫完作業了！')

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
it 