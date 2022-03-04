const express = require('express')
const router = express.Router()
const { authenticated } = require('../middleware/auth')
const cpUpload = require('../middleware/multer')
const { apiErrorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/api/userController.js')


// USER
router.get('/users/:userId', authenticated, userController.getUser)
router.post('/users/:userId', authenticated, cpUpload, userController.postUser)

// Error Handlers
router.use('/', apiErrorHandler)

module.exports = router