const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const { User, Tweet, Like } = require('../models')
const helpers = require('../_helpers')

const userServices = {
  signUp: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body

    if (password !== checkPassword) throw new Error('確認密碼與密碼不相符!')

    User.findOne({ where: { [Op.or]: [{ account }, { email }] } })
      .then(user => {
        if (user && user.account === account) throw new Error('account 已重覆註冊！')
        if (user && user.email === email) throw new Error('email 已重覆註冊！')

        return User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        })
      })
      .then((newUser) => {
        return cb(null, { user: newUser })
      })
      .catch(err => cb(err))
  },
  addLike: (req, cb) => {
    const { tweetId } = req.params
    const loginUser = helpers.getUser(req)
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          UserId: loginUser.id,
          TweetId: tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('喜歡的貼文不存在或已被刪除!')
        if (like) throw new Error('你已對這則貼文按過喜歡!')

        return Promise.all([
          tweet.increment('likeCounts'),
          Like.create({
            UserId: loginUser.id,
            TweetId: tweetId
          })
        ])
      })
      .then(([tweet, like]) => {
        return cb(null, { tweet, like })
      })
      .catch(err => cb(err))
    }
}

module.exports = userServices