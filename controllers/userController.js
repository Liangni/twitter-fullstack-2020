const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'd97de9c03bf7519'
const db = require('../models')
const tweet = require('../models/tweet')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const helpers = require('../_helpers')

const getLink = (filePath) => {
  return new Promise((resolve, reject) => {
    imgur.setClientID(IMGUR_CLIENT_ID)
    imgur.upload(filePath, (err, img) => {
      if (err) {
        return reject(err)
      }
      return resolve(img.data.link)
    })
  })
}

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) {
      req.flash('error_messages', '密碼與檢查密碼不一致！')
      res.redirect('/signup')
    } else {
      return User.findOne({
        where: {
          [Op.or]: [{ account }, { email }]
        }
      })
        .then((user) => {
          if (user) {
            if (user.account === account) { req.flash('error_messages', 'account 已重覆註冊！') }
            else { req.flash('error_messages', 'email 已重覆註冊！') }
            res.redirect('/signup')
          } else {
            req.flash('success_messages', '註冊成功!')
            return User.create({
              account,
              name,
              email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => { res.redirect('/signin') })
          }
        })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.userId)) {
      return res.json({ status: 'error', message:'' })
    }
    return User.findByPk(req.params.userId)
      .then(user => {
        return res.json(user.toJSON())
    })
  },
  postUser: async (req, res) => {
    const { name, introduction } = req.body
    const { files } = req
    let coverLink
    let avatarLink

    if (files) {
      if (files.cover) {
        coverLink = await getLink(files.cover[0].path)
      }
      if (files.avatar) {
        avatarLink = await getLink(files.avatar[0].path)
      }
      return User.findByPk(req.params.userId)
        .then((user) => {
          return user.update({
            name,
            introduction,
            cover: files.cover ? coverLink : user.cover,
            avatar: files.avatar ? avatarLink : user.avatar
          })
        })
        .then((user) => {
          req.flash('success_messages', '更新個人資料頁成功！')
          return res.redirect(`/users/${req.params.userId}/tweets`)
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
          req.flash('success_messages', '更新個人資料頁成功！')
          return res.end()
        })
    }
  },
  //使用者個人資料頁面
  getUserTweets: (req, res) => {
    return User.findByPk(req.params.userId, {
      include: Tweet
    })
      .then(user => {
        return res.render('userTweets', {
          user: user.toJSON(),
        })
      })
  },
  //設定使用者個人資料頁面推文與回覆頁面
  getUserReplies: (req, res) => {
    return User.findByPk(req.params.userId, {
      include: [Reply, Tweet]
    })
      .then(user => {
        return res.render('userReplies', {
          user: user.toJSON()
        })
      })
  },
  // 瀏覽帳號設定頁面
  editSetting: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.userId)) {
      req.flash('error_messages', '你沒有檢視此頁面的權限')
      return res.redirect(`/users/${helpers.getUser(req).id}/setting/edit`)
    }
    return User.findByPk(req.params.userId).then((user) => {
      return res.render('setting', { user: user.toJSON() })
    })
  },

  // 更新帳號設定
  putSetting: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body

    // 檢查使用者是否有編輯權限
    if (helpers.getUser(req).id !== Number(req.params.userId)) {
      req.flash('error_messages', '你沒有檢視此頁面的權限')
      return res.redirect(`/users/${helpers.getUser(req).id}/setting/edit`)
    }

    // 如使用者有輸入密碼或確認密碼，檢查是否一致
    if (password.trim() || passwordCheck.trim()) {
      if (password !== passwordCheck) {
        req.flash('error_messages', '密碼與確認密碼不一致！')
        return res.redirect('back')
      }
    }
    // 檢查是否有其他使用者重複使用表單的帳號或Email
    return User.findOne({
      where: {
        id: { [Op.ne]: helpers.getUser(req).id },
        [Op.or]: [{ account }, { email }]
      }
    }).then((user) => {
      if (user) {　// 如其他使用者存在，區分是重複帳號還是Email
        if (user.account === account) { req.flash('error_messages', 'account 已重覆註冊！') }
        else { req.flash('error_messages', 'email 已重覆註冊！') }
        return res.redirect('back')
      } else {        
        return User.findByPk(req.params.userId).then((user) => {
          return user.update({
            account,
            name,
            email,
            password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password
          })
            .then(user => {
              req.flash('success_messages', '帳號資料更新成功!')
              return res.redirect(`/users/${req.params.userId}/setting/edit`)
            })
        })
      }
    })
  }
}

module.exports = userController