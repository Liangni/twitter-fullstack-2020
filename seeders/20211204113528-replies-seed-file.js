'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((item, i) => ({
        comment: faker.lorem.sentence(),
        UserId: Math.floor(Math.random() * 6) + 1,
        TweetId: Math.floor(Math.random() * 50) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Replies', null, {})
  }
};
