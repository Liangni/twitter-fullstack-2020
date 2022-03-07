const userServices = require('../../services/user-services')

const userController = {
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => { err? next(err) : res.json(data.user) })
  },
  postUser: (req, res, next) => {
    userServices.postUser(req, (err, data) => { err ? next(err) : res.json({ status: 'success', data }) })
  },
}

module.exports = userController