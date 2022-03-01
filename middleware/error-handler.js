module.exports = {
  generalErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }

    const url = req.headers.referer? 'back' : '/tweets'
    res.redirect(url)
    next(err)
  }
}