const replyServices = require('../services/reply-services')

const replyController = {
  //設定新增留言
  postReply: (req, res, next) => {
    replyServices.postReply(req, (err, data) => {
      err ? next(err) : 
      res.redirect('back')
    })
  }
}

module.exports = replyController