"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_activity", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_lengkap: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      username: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      time: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      method: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      path: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      code: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      user_info: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      payload: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_activity");
  },
};
