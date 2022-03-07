const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')
const sharedServices = require('../services/shared-services')

const tweetController = {

  getTweets: (req, res, next) => {
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
        return res.render('tweets', { tweets: tweetsData, popularUsers, loginUser })
      })
      .catch(err => next(err))
  },

  //前台瀏覽個別推文
  getTweet: (req, res, next) => {
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
      return res.render('tweet', {
        tweet: tweet.toJSON(),
        loginUser,
        popularUsers
      })
    })
    .catch(err => next(err))
  },
  //新增推文
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (description.length > 140) throw new Error('字數不可超過140字')
    if (description.length < 1) throw new Error('內容不可為空白')
      
    Tweet.create({
      description,
      UserId: helpers.getUser(req).id
    })
    .then(() => res.redirect('/tweets') )
    .catch(err => next(err))
  }
}

module.exports = tweetController