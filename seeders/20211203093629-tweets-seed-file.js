'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, i) =>
      ({
        id: i + 1,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCounts: 0 ,
        replyCounts: 3 ,
        UserId: Math.floor(Math.random() * 5) + 2 // 跳過root(id=1)，使2 <= id < 7
      })

      ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {})
  }
};
