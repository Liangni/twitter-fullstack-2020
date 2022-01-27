const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

const userController = require('../controllers/api/userController.js')

// AUTHENTICATION
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return res.redirect('/admin/tweets')
    }
    return next()
  }
  res.redirect('/signin')
}

// USER
router.get('/users/:userId', authenticated, userController.getUser)
router.post('/users/:userId', authenticated, cpUpload, userController.postUser)

module.exports = router