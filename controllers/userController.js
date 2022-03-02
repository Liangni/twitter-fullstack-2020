const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')
const userServices = require('../services/user-services')


const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => { 
      err ? next(err) : 
      req.flash('success_messages', '註冊成功!')
      res.redirect('/signin')
    })
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  // like tweet
  addLike: (req, res, next) => {
    userServices.addLike(req, (err, data) => { err ? next(err) : res.redirect('back') })
  },
  // unlike tweet
  removeLike: (req, res, next) => {
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
          like.destroy(),
          tweet.decrement('likeCounts')
        ])
      })
      .then(() => {
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  // following
  addFollowing: (req, res, next) => {
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
      .then(() => {
        req.flash('success_messages', '跟隨成功')
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  // removeFollowing
  removeFollowing: (req, res, next) => {
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
      .then(() => {
        req.flash('success_messages', '取消跟隨')
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  //使用者個人資料頁面
  getUserTweets: (req, res, next) => {
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
        const likedTweetIds = loginUser.LikedTweets? loginUser.LikedTweets.map(t => t.id) : []
        const userTweets = user.Tweets.map(result => ({
          ...result.dataValues,
          isLiked: likedTweetIds.includes(result.id)
        }))
        return res.render('userTweets', {
          loginUser,
          user: user.toJSON(),
          isFollowed,
          userTweets,
          popularUsers
        })  
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const loginUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.userId, {
        include: [
          Tweet,
          { model: Reply, include: [{ model: Tweet, include: [User] }] } ,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      helpers.getPopularUsers(req)
    ])
      .then(([user, popularUsers]) => {
        if (!user) throw new Error('使用者不存在!')

        const isFollowed = loginUser.Followings ? loginUser.Followings.map(f => f.id).includes(user.id) : false
        return res.render('userReplies', {
          loginUser,
          user: user.toJSON(),
          isFollowed,
          popularUsers
        })
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const loginUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.userId, {
        include: [
          Tweet,
          Like,
          { model: Tweet, as: 'LikedTweets', include: [User] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [[Like, 'createdAt', 'DESC']],
      }),
      helpers.getPopularUsers(req)
    ])
      .then(([user, popularUsers]) => {
        if (!user) throw new Error('使用者不存在!')

        const isFollowed = loginUser.Followings ? loginUser.Followings.map(f => f.id).includes(user.id) : false
        const likedTweetIds = loginUser.LikedTweets ? loginUser.LikedTweets.map(t => t.id) : []
        const userLikedTweets = user.LikedTweets.map(tweet => ({
          ...tweet.dataValues,
          isLiked: likedTweetIds.includes(tweet.id)
        }))
        return res.render('userLikes', { 
          loginUser,
          user: user.toJSON(),
          isFollowed,
          userLikedTweets,
          popularUsers 
        })
      })
      .catch(err => next(err))
  },
  // 瀏覽 user 的 followings
  getUserFollowing: (req, res, next) => {
    const loginUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.userId, {
        include: [
          Tweet,
          { model: User, as: 'Followings' }
        ]
      }),
      helpers.getPopularUsers(req)
    ])
      .then(([user, popularUsers]) => {
        if (!user) throw new Error('使用者不存在!')

        const followingIds = loginUser.Followings ? loginUser.Followings.map(f => f.id) : []
        const followings = user.Followings.map(u => ({
          ...u.dataValues,
          isFollowed: followingIds.includes(u.id)
        })).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
            
        return res.render('userFollowings', {
          loginUser,
          user: user.toJSON(),
          followings,
          popularUsers,
        })
      })
      .catch(err => next(err))
  },
  // 瀏覽 user 的 followers
  getUserFollower: (req, res, next) => {
    const loginUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(req.params.userId, {
        include: [
          Tweet,
          { model: User, as: 'Followers' }
        ]
      }),
      helpers.getPopularUsers(req)
    ]) 
    .then(([user, popularUsers]) => {
      if (!user) throw new Error('使用者不存在!')

      const followingIds = loginUser.Followings? loginUser.Followings.map(f => f.id) : []
      const followers = user.Followers.map(user => ({
        ...user.dataValues,
        isFollowed: followingIds.includes(user.id)
      })).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      return res.render('userFollowers', {
        loginUser,
        user: user.toJSON(),
        followers,
        popularUsers,
      })
    })
    .catch(err => next(err))  
  },
  // 瀏覽帳號設定頁面
  settingPage: (req, res, next) => {
    const userId = Number(req.params.userId)
    if (helpers.getUser(req).id !== userId ) throw new Error('你沒有檢視此頁面的權限')
      
    return User.findByPk(userId)
      .then(user => res.render('setting', { user: user.toJSON() }))
      .catch(err => next(err))
  },
  // 更新帳號設定
  putSetting: (req, res, next) => {
    const { account, name, email, password, passwordCheck } = req.body
    const userId = Number(req.params.userId)
    const loginUser = helpers.getUser(req)

    // 檢查使用者是否有編輯權限
    if (loginUser.id !== userId) throw new Error('你沒有變更權限')

    // 如使用者有輸入密碼或確認密碼，檢查是否一致
    const isNotEmptyStr = password.trim() || passwordCheck.trim()
    if (isNotEmptyStr && password !== passwordCheck) throw new Error('密碼與確認密碼不一致！')

    // 檢查是否有其他使用者重複使用表單的帳號或Email
    return User.findOne({
      where: {
        id: { [Op.ne]: loginUser.id },
        [Op.or]: [{ account }, { email }]
      }
    })
      .then((otherUser) => {
        // 如其他使用者存在，區分是重複帳號還是Email
        if (otherUser && otherUser.account === account) throw new Error('account 已重覆註冊！')
        if (otherUser && otherUser.email === email) throw new Error('email 已重覆註冊！')

        return User.findByPk(userId)
      })
      .then((user) => {
        return user.update({
          account,
          name,
          email,
          password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password
        })
      })
      .then(() => {
        req.flash('success_messages', '帳號資料更新成功!')
        return res.redirect('back')
      })
      .catch(err => next(err))
  }

}

module.exports = userController