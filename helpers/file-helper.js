const fs = require('fs/promises')
const axios = require('axios').default
const FormData = require('form-data')

const IMGUR_API_URL = 'https://api.imgur.com/3/image'

module.exports = {
  localFileHandler (file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null)

      const fileName = `upload/${file.originalname}`
      return fs.readFile(file.path)
        .then(data => fs.writeFile(fileName, data))
        .then(() => resolve(`/${fileName}`))
        .catch(err => reject(err))
    })
  },
  async imgurUploader (file) {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = (await axios.post(IMGUR_API_URL, formData, {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          ...formData.getHeaders()
        }
      })).data

      if (response.success) return response.data.link
      else throw new Error('Fail to upload the image to imgur')
    } catch (err) {
      err.alertMsg = '圖片上傳失敗'
      throw err
    }
  }
}
