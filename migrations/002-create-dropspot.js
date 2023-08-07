"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dropspot", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      area_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "area",
          key: "id",
        },
      },
      nama: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: [
          "by_negara",
          "by_provinsi",
          "by_kabupaten",
          "by_kecamatan",
          "by_desa",
        ],
      },
      cakupan: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      harga: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("dropspot");
  },
};
