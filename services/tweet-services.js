const { Tweet, User, Reply, Like } = require('../models')
const sharedServices = require('./shared-services')
const helpers = require('../_helpers')

const tweetServices = {
  getTweets: (req, cb) => {
    return Promise.all([
      Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [
          User,
          Reply,
          { model: User, as: 'LikedUsers' }
        ]
      }),
      sharedServices.getPopularUsers(req)
    ])
      .then(([tweets, popularUsers]) => {
        const loginUser = helpers.getUser(req)
        const likedTweetIds = loginUser.LikedTweets ? loginUser.LikedTweets.map(tweet => tweet.id) : []
        const tweetsData = tweets.map(tweet => ({
          ...tweet.dataValues,
          isLike: likedTweetIds.includes(tweet.id)
        }))
        return cb(null, { tweets: tweetsData, popularUsers, loginUser }) 
      })
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    return Promise.all([
      Tweet.findByPk(req.params.id, {
        include: [
          User,
          { model: Reply, include: [User] },
          { model: User, as: 'LikedUsers' }
        ]
      }),
      sharedServices.getPopularUsers(req)
    ])
      .then(([tweet, popularUsers]) => {
        if (!tweet) throw new Error('貼文不存在!')

        const loginUser = helpers.getUser(req)
        const likedTweetIds = loginUser.LikedTweets ? loginUser.LikedTweets.map(tweet => tweet.id) : []
        tweet.dataValues.isLiked = likedTweetIds.includes(tweet.id)
        return cb(null, {
          tweet: tweet.toJSON(),
          loginUser,
          popularUsers
        })
      })
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const { description } = req.body
    if (description.length > 140) throw new Error('字數不可超過140字')
    if (description.length < 1) throw new Error('內容不可為空白')

    return Tweet.create({
      description,
      UserId: helpers.getUser(req).id
    })
      .then((newTweet) => cb(null, { tweet: newTweet }))
      .catch(err => cb(err))
  }
}

module.exports = tweetServices