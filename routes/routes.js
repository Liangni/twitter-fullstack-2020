const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])
const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')


  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return res.redirect('/admin/tweets')
      }
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/admin/signin')
  }

  router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  router.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  //router.get('/tweets', authenticated, (req, res) => res.render('tweets', { user: helpers.getUser(req) }))
  // user 系列
  // 瀏覽首頁
  router.get('/tweets', authenticated, tweetController.getTweets)
  // 瀏覽特定推文的推文與回覆串
  router.get('/tweets/:id/replies', authenticated, tweetController.getTweet)
  // user 新增推文
  router.post('/tweets', authenticated, tweetController.postTweet)
  // user 新增留言(回覆)
  router.post('/tweets/:tweetId/replies', authenticated, replyController.postReply)
  // 瀏覽特定user的個人資料 - 推文頁面
  router.get('/users/:userId/tweets', authenticated, userController.getUserTweets)
  // 瀏覽特定user的個人資料 - 回覆頁面
  router.get('/users/:userId/replies', authenticated, userController.getUserReplies)
  // 瀏覽特定user的個人資料 - 喜歡頁面
  router.get('/users/:userId/likes', authenticated, userController.getUserLikes)
  // 瀏覽編輯使用者頁面
  router.get('/api/users/:userId', userController.getUser)
  // 更新編輯使用者
  router.post('/api/users/:userId', cpUpload, userController.postUser)
  // user followings頁面
  router.get('/users/:userId/followings', authenticated, userController.getUserFollowing)
  //user followers頁面
  router.get('/users/:userId/followers', authenticated, userController.getUserFollower)
  // user對貼文按喜歡
  router.post('/tweets/:tweetId/like', authenticated, userController.addLike)
  // user對貼文收回喜歡
  router.post('/tweets/:tweetId/unlike', authenticated, userController.removeLike)
  // 跟隨user
  router.post('/followships', authenticated, userController.addFollowing)
  // 取消跟隨user
  router.delete('/followships/:followingId', authenticated, userController.removeFollowing)
  // 瀏覽user帳號設定頁面
  router.get('/users/:userId/setting/edit', authenticated, userController.editSetting)
  // 更新帳號設定
  router.put('/users/:userId/setting', authenticated, userController.putSetting)
  // login - normal user
  router.get('/signup', userController.signUpPage)
  router.post('/signup', userController.signUp)
  router.get('/signin', userController.signInPage)
  router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  router.get('/logout', userController.logout)
  // login - admin user
  router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  router.get('/admin/signin', adminController.signInPage)
  router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin)
  router.delete('/admin/tweets/:tweetId', authenticatedAdmin, adminController.deleteTweet)
  router.get('/admin/logout', adminController.logout)

  module.exports = router