const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {

  getTweets: (req, res) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        User,
        Reply,
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(tweets => {
        // 撈 popular user view 的資料
        User.findAll({
          include: [{ model: User, as: 'Followers' }],
          where: { role: 'normal' }
        })
          .then(users => {
            tweets = tweets.map(tweet => {
              if (tweet.dataValues !== undefined) {
                return {
                  ...tweet.dataValues,
                  loginUser: helpers.getUser(req),
                  tweetsUserAvatar: tweet.dataValues.User.avatar,
                  tweetsUserName: tweet.User.name,
                  tweetsUserAccount: tweet.User.account,
                  tweetsCreatedAt: tweet.createdAt,
                  tweetUserId: tweet.User.id,
                  tweetsId: tweet.id,
                  tweetsContent: tweet.description,
                  isLiked: tweet.LikedUsers.map(item => item.id).includes(helpers.getUser(req).id),
                  replyTotal: tweet.Replies.length,
                  likeTotal: tweet.LikedUsers.length
                }
              }
            })

            users = users.map(user => ({
              ...user.dataValues,
              topUserAvatar: user.avatar,
              topUserName: user.name,
              topUserAccount: user.account,
              followerCount: user.Followers.length,
              isFollowed: helpers.getUser(req).Followings.map(f => f.id).includes(user.id)
            }))
            users = users.sort((a, b) => b.followerCount - a.followerCount)
            return res.render('tweets', { tweets, users, user: helpers.getUser(req) })
          })
      })
  },

  //前台瀏覽個別推文
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] }
      ]
    }).then(tweet => {
      return res.render('tweet', {
        tweet: tweet.toJSON(),
        user: helpers.getUser(req)
      })
    })
  },
  //新增推文
  postTweet: (req, res) => {
    if (req.body.description.length > 140) {
      req.flash('error_messages', '字數不可超過140字')
      return res.redirect('back')
    }
    if (req.body.description.length < 1) {
      req.flash('error_messages', '內容不可為空白')
      return res.redirect('back')
    }
    Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    }).then(tweets => {
      return res.redirect('/tweets')
    })
  }
}

module.exports = tweetController