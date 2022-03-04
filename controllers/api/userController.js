const db = require('../../models')
const User = db.User
const helpers = require('../../_helpers')
const fileHelpers = require('../../helpers/file-helpers')

const userController = {
  getUser: (req, res, next) => {
    const loginUser = helpers.getUser(req)
    const userId = Number(req.params.userId)
    if (loginUser.id !== userId) throw new Error('你沒有檢視此頁面的權限')
    
    return User.findByPk(userId)
      .then(user => res.json(user.toJSON()))
      .catch(err => next(err))
  },
  postUser: (req, res) => {
    const { name, introduction } = req.body
    const { files } = req

    if (files) {
      Promise.all([
        fileHelpers.getImgurLink(files.cover),
        fileHelpers.getImgurLink(files.avatar),
        User.findByPk(req.params.userId)
      ])
        .then(([coverLink, avatarLink, user]) => {
          return user.update({
            name,
            introduction,
            cover: files.cover ? coverLink : user.cover,
            avatar: files.avatar ? avatarLink : user.avatar
          })
        })
        .then((user) => {
          return res.json({ status: 'success', message: '更新個人資料頁成功！' })
        })
    } else {
      return User.findByPk(req.params.userId)
        .then((user) => {
          return user.update({
            name,
            introduction,
          })
        })
        .then((user) => {
          return res.json({ status: 'success', message: '更新個人資料頁成功！' })
        })
    }
  },
}

module.exports = userController