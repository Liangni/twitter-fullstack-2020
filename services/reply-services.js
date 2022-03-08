const { Reply, Tweet } = require('../models')
const helpers = require('../_helpers')

const replyServices = {
  postReply: (req, cb) => {
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
      .then(([newReply, tweet]) => cb(null, { reply: newReply }))
      .catch(err => cb(err))
  }
}

module.exports = replyServices