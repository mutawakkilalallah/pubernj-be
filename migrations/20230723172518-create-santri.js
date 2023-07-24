"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("santri", {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      niup: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      nama_lengkap: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      wilayah_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      blok_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      status_kepulangan: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["tidak-pulang", "pulang-rombongan"],
        defaultValue: "tidak-pulang",
      },
      raw: {
        allowNull: false,
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
    await queryInterface.dropTable("santri");
  },
};
