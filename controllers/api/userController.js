const db = require('../../models')
const User = db.User
const helpers = require('../../_helpers')

const userController = {
  getUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.userId)) {
      return res.json({ status: 'error', message: '' })
    }
    return User.findByPk(req.params.userId)
      .then(user => {
        return res.json(user.toJSON())
      })
  },
  postUser: (req, res) => {
    const { name, introduction } = req.body
    const { files } = req

    if (files) {
      Promise.all([
        helpers.getImgurLink(files.cover),
        helpers.getImgurLink(files.avatar),
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
          // req.flash('success_messages', '更新個人資料頁成功！')
          // return res.redirect(`/users/${req.params.userId}/tweets`)
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
          // req.flash('success_messages', '更新個人資料頁成功！')
          // return res.end()
        })
    }
  },
}

module.exports = userController