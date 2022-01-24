const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('./models')
const User = db.User


function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function isMatch(a , b) {
  if (a === b) { 
    return true
  } else {
    return false
    }
  }

  function getPopularUsers(req) {
    return User.findAll({ 
      where: { role: 'normal' },
      include: { model: User, as: 'Followers' }
    }).then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: this.getUser(req).Followings.map(d => d.id).includes(user.id)
        }))
        popularUsers = users.sort((a, b) => b.FollowerCount - a.FollowerCount ).slice(0,10)
        return popularUsers
      })
  }

function getImgurLink(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve(null)
    }
    imgur.setClientID(IMGUR_CLIENT_ID)
    imgur.upload(file[0].path, (err, img) => {
      if (err) {
        return reject(err)
      }
      return resolve(img.data.link)
    })
  })
}

module.exports = {
  ensureAuthenticated,
  getUser,
  isMatch,
  getPopularUsers,
  getImgurLink
};