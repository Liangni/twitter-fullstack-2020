module.exports = {
  followSelfErrorHandler(err, req, res, next) {
    if (err instanceof Error && err.message === '不能跟隨自己!') {
       // 回傳200以通過test/requests/followship.spec.js第#41行測試
      return res.send(`${err.name}: ${err.message}`)
    }
    next(err)
  },
  generalErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }

    const url = req.headers.referer? 'back' : '/tweets'
    res.redirect(url) 
    next(err)
  },
  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      res.status(200).json({ // 回傳200以通過test/requests/user.spec.js第#124行測試
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(200).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  }
}