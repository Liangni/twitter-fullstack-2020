const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const helpers = require('../_helpers')

const replyController = {
  //設定新增留言
  postReply: (req, res, next) => {
    const tweetId = req.params.tweetId

    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error('回應的貼文不存在!')

        return Promise.all([
          Reply.create({
            comment: req.body.comment,
            TweetId: tweetId,
            UserId: helpers.getUser(req).id
          }),
          tweet.increment('replyCounts')
        ])
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = replyController