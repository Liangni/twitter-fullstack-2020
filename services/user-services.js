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
}

module.exports = userServices