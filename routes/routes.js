const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { followSelfErrorHandler, generalErrorHandler } = require('../middleware/error-handler')

const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')


// ADMIN
router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin)
router.get('/admin/logout', adminController.logout)
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:tweetId', authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  
// USER
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/users/:userId/tweets', authenticated, userController.getUserTweets)
router.get('/users/:userId/replies', authenticated, userController.getUserReplies)
router.get('/users/:userId/likes', authenticated, userController.getUserLikes)
router.get('/users/:userId/followings', authenticated, userController.getUserFollowing)
router.get('/users/:userId/followers', authenticated, userController.getUserFollower)

// TWEET
router.get('/', authenticated, (req, res) => res.redirect('/tweets'))
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:id/replies', authenticated, tweetController.getTweet)
router.post('/tweets', authenticated, tweetController.postTweet)

// REPLY
router.post('/tweets/:tweetId/replies', authenticated, replyController.postReply)

// LIKE
router.post('/tweets/:tweetId/like', authenticated, userController.addLike)
router.post('/tweets/:tweetId/unlike', authenticated, userController.removeLike)

// FOLLOWSHIP
router.post('/followships', authenticated, userController.addFollowing)
router.delete('/followships/:followingId', authenticated, userController.removeFollowing)
  
// SETTEING
router.get('/users/:userId/setting/edit', authenticated, userController.settingPage)
router.put('/users/:userId/setting', authenticated, userController.putSetting)

// Error Handlers
router.use('/', followSelfErrorHandler, generalErrorHandler )
  
module.exports = router