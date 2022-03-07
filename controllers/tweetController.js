const tweetServices = require('../services/tweet-services')

const tweetController = {

  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) => {
      err ? next(err) :
      res.render('tweets', data )
    })
  },
  //前台瀏覽個別推文
  getTweet: (req, res, next) => {
    tweetServices.getTweet(req, (err, data) => {
      err ? next(err) :
      res.render('tweet', data)
    })
  },
  //新增推文
  postTweet: (req, res, next) => {
    tweetServices.postTweet(req, (err, data) => {
      err ? next(err) :
      res.redirect('/tweets')
    })
  }
}

module.exports = tweetController