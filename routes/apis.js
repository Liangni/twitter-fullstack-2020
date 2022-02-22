const express = require('express')
const router = express.Router()
const { authenticated } = require('../middleware/auth')
const cpUpload = require('../middleware/multer')

const userController = require('../controllers/api/userController.js')


// USER
router.get('/users/:userId', authenticated, userController.getUser)
router.post('/users/:userId', authenticated, cpUpload, userController.postUser)

module.exports = router