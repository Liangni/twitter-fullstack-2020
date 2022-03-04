const { User } = require('../../models')
const userServices = require('../../services/user-services')
const helpers = require('../../_helpers')
const fileHelpers = require('../../helpers/file-helpers')

const userController = {
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => { err? next(err) : res.json(data.user) })
  },
  postUser: (req, res, next) => {
    const { name, introduction } = req.body
    const { files } = req

    return Promise.all([
      fileHelpers.getImgurLink(files?.cover || null),
      fileHelpers.getImgurLink(files?.avatar || null),
      User.findByPk(req.params.userId)
    ])
      .then(([coverLink, avatarLink, user]) => {
        return user.update({
          name,
          introduction,
          cover: coverLink || user.cover,
          avatar: avatarLink || user.avatar
        })
      })
      .then((user) => {
        return res.json({ status: 'success', message: '更新個人資料頁成功！' })
      })
      .catch(err => next(err))
  },
}

module.exports = userController