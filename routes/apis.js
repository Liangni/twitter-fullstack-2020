const express = require('express')
const router = express.Router()
const { authenticated } = require('../middleware/auth')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

const userController = require('../controllers/api/userController.js')


// USER
router.get('/users/:userId', authenticated, userController.getUser)
router.post('/users/:userId', authenticated, cpUpload, userController.postUser)

module.exports = router