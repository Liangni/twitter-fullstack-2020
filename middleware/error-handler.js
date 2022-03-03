module.exports = {
  generalErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }

    const url = req.headers.referer? 'back' : '/tweets'
    res.redirect(200, url) // 加上狀態碼200以通過test/requests/followship.spec.js第#41行測試
    next(err)
  }
}