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
    userServices.removeLike(req, (err, data) => { err ? next(err) : res.redirect('back') })
  },
  // following
  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, res, (err, data) => { 
      err ? next(err) : 
      req.flash('success_messages', '跟隨成功')
      res.redirect('back')})
  },
  // removeFollowing
  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, (err, data) => {
      err ? next(err) :
      req.flash('success_messages', '取消跟隨')
      res.redirect('back')
    })
  },
  //使用者個人資料頁面
  getUserTweets: (req, res, next) => {
    userServices.getUserTweets(req, (err, data) => { err? next(err) : res.render('userTweets', data) })
  },
  getUserReplies: (req, res, next) => {
    userServices.getUserReplies(req, (err, data) => { err ? next(err) : res.render('userReplies', data) })
  },
  getUserLikes: (req, res, next) => {
    userServices.getUserLikes(req, (err, data) => { err? next(err) : res.render('userLikes', data) })
  },
  // 瀏覽 user 的 followings
  getUserFollowing: (req, res, next) => {
    userServices.getUserFollowing(req, (err, data) => { 
      err ? next(err) : res.render('userFollowings', data)
    })
  },
  // 瀏覽 user 的 followers
  getUserFollower: (req, res, next) => {
    userServices.getUserFollower(req, (err, data) => { 
      err ? next(err) : res.render('userFollowers', data)
    }) 
  },
  // 瀏覽帳號設定頁面
  settingPage: (req, res, next) => {
    userServices.getUser(req, (err, data) => { err? next(err) :  res.render('setting', data)})
  },
  // 更新帳號設定
  putSetting: (req, res, next) => {
    userServices.putSetting(req, (err, data) => {
      err ? next(err) : 
      req.flash('success_messages', '帳號資料更新成功!')
      res.redirect('back') 
    })
  }

}

module.exports = userController