const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const { User, Tweet, Like, Followship, Reply } = require('../models')
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
  },
  removeLike: (req, cb) => {
    return Promise.all([
      Tweet.findByPk(req.params.tweetId),
      Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!like) throw new Error('你沒有對這則貼文按過喜歡!')

        return Promise.all([
          tweet.decrement('likeCounts'),
          like.destroy()
        ])
      })
      .then(([tweet, like]) => {
        return cb(null, { tweet, like })
      })
      .catch(err => cb(err))
  },
  addFollowing: (req, res, cb) => {
    const loginUser = helpers.getUser(req)
    const popularUserId = Number(req.body.id)
    // 登入使用者不行追蹤自己
    if (loginUser.id === popularUserId) { return res.render('followSelf') }

    return Promise.all([
      User.findByPk(popularUserId),
      Followship.findOne({
        where: {
          followerId: loginUser.id,
          followingId: popularUserId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('跟隨的使用者不存在!')
        if (followship) throw new Error('你已經跟隨過該使用者!')

        return Followship.create({
          followerId: loginUser.id,
          followingId: popularUserId
        })
      })
      .then((followship) => {
        return cb(null, { followship })
      })
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    const followingId = req.params.followingId

    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: followingId
      }
    })
      .then(followship => {
        if (!followship) throw new Error('你沒有跟隨這名使用者!')
        return followship.destroy()
      })
      .then((followship) => {
        return cb(null, { followship })
      })
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    const loginUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.userId, {
        include: [
          { model: Tweet, include: [{ model: User, as: 'LikedUsers' }] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ],
        order: [[Tweet, 'createdAt', 'DESC']]
      }),
      helpers.getPopularUsers(req)
    ])
      .then(([user, popularUsers]) => {
        if (!user) throw new Error('使用者不存在!')

        const isFollowed = loginUser.Followings ? loginUser.Followings.map(f => f.id).includes(user.id) : false
        const likedTweetIds = loginUser.LikedTweets ? loginUser.LikedTweets.map(t => t.id) : []
        const userTweets = user.Tweets.map(result => ({
          ...result.dataValues,
          isLiked: likedTweetIds.includes(result.id)
        }))
        return cb(null, {
          loginUser,
          user: user.toJSON(),
          isFollowed,
          userTweets,
          popularUsers
        })
      })
      .catch(err => cb(err))
  },
  getUserReplies: (req, cb) => {
    const loginUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.userId, {
        include: [
          Tweet,
          { model: Reply, include: [{ model: Tweet, include: [User] }] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      helpers.getPopularUsers(req)
    ])
      .then(([user, popularUsers]) => {
        if (!user) throw new Error('使用者不存在!')

        const isFollowed = loginUser.Followings ? loginUser.Followings.map(f => f.id).includes(user.id) : false
        return cb(null, {
          loginUser,
          user: user.toJSON(),
          isFollowed,
          popularUsers
        })
      })
      .catch(err => cb(err))
  },
  getUserLikes: (req, cb) => {
    const loginUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.userId, {
        include: [
          Tweet,
          Like,
          { model: Tweet, as: 'LikedTweets', include: [User] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [[Like, 'createdAt', 'DESC']],
      }),
      helpers.getPopularUsers(req)
    ])
      .then(([user, popularUsers]) => {
        if (!user) throw new Error('使用者不存在!')

        const isFollowed = loginUser.Followings ? loginUser.Followings.map(f => f.id).includes(user.id) : false
        const likedTweetIds = loginUser.LikedTweets ? loginUser.LikedTweets.map(t => t.id) : []
        const userLikedTweets = user.LikedTweets.map(tweet => ({
          ...tweet.dataValues,
          isLiked: likedTweetIds.includes(tweet.id)
        }))
        return cb(null, {
          loginUser,
          user: user.toJSON(),
          isFollowed,
          userLikedTweets,
          popularUsers
        })
      })
      .catch(err => cb(err))
  },
  getUserFollowing: (req, cb) => {
    const loginUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.userId, {
        include: [
          Tweet,
          { model: User, as: 'Followings' }
        ]
      }),
      helpers.getPopularUsers(req)
    ])
      .then(([user, popularUsers]) => {
        if (!user) throw new Error('使用者不存在!')

        const followingIds = loginUser.Followings ? loginUser.Followings.map(f => f.id) : []
        const followings = user.Followings.map(u => ({
          ...u.dataValues,
          isFollowed: followingIds.includes(u.id)
        })).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

        return cb(null, {
          loginUser,
          user: user.toJSON(),
          followings,
          popularUsers,
        })
      })
      .catch(err => cb(err))
  },
  getUserFollower: (req, cb) => {
    const loginUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.userId, {
        include: [
          Tweet,
          { model: User, as: 'Followers' }
        ]
      }),
      helpers.getPopularUsers(req)
    ])
      .then(([user, popularUsers]) => {
        if (!user) throw new Error('使用者不存在!')

        const followingIds = loginUser.Followings ? loginUser.Followings.map(f => f.id) : []
        const followers = user.Followers.map(user => ({
          ...user.dataValues,
          isFollowed: followingIds.includes(user.id)
        })).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        return cb(null, {
          loginUser,
          user: user.toJSON(),
          followers,
          popularUsers,
        })
      })
      .catch(err => cb(err))
  },
  settingPage: (req, cb) => {
    const userId = Number(req.params.userId)
    if (helpers.getUser(req).id !== userId) throw new Error('你沒有檢視此頁面的權限')

    return User.findByPk(userId)
      .then(user => cb(null, { user: user.toJSON() }))
      .catch(err => cb(err))
  },
  putSetting: (req, cb) => {
    const { account, name, email, password, passwordCheck } = req.body
    const userId = Number(req.params.userId)
    const loginUser = helpers.getUser(req)

    // 檢查使用者是否有編輯權限
    if (loginUser.id !== userId) throw new Error('你沒有變更權限')

    // 如使用者有輸入密碼或確認密碼，檢查是否一致
    const isNotEmptyStr = password.trim() || passwordCheck.trim()
    if (isNotEmptyStr && password !== passwordCheck) throw new Error('密碼與確認密碼不一致！')

    // 檢查是否有其他使用者重複使用表單的帳號或Email
    return User.findOne({
      where: {
        id: { [Op.ne]: loginUser.id },
        [Op.or]: [{ account }, { email }]
      }
    })
      .then((otherUser) => {
        // 如其他使用者存在，區分是重複帳號還是Email
        if (otherUser && otherUser.account === account) throw new Error('account 已重覆註冊！')
        if (otherUser && otherUser.email === email) throw new Error('email 已重覆註冊！')

        return User.findByPk(userId)
      })
      .then((user) => {
        return user.update({
          account,
          name,
          email,
          password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password
        })
      })
      .then((user) => {
        cb(null, { user: user.toJSON() })
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices