const { User } = require('../models')
const helpers = require('../_helpers')

const sharedServices = {
  getPopularUsers: (req) => {
    return User.findAll({
      where: { role: 'normal' },
      include: { model: User, as: 'Followers' }
    }).then(users => {
      const followingIds = helpers.getUser(req).Followings ? helpers.getUser(req).Followings.map(f => f.id) : []
      const popularUsers = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: followingIds.includes(user.id)
      })).sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
      return popularUsers
    })
  }
}

module.exports = sharedServices
