const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientID(IMGUR_CLIENT_ID)

function getImgurLink(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    
    return imgur.upload(file[0].path, (err, img) => {
      if (err) {
        return reject(err)
      }
      return resolve(img.data.link)
    })
  })
}

module.exports = {
  getImgurLink
};