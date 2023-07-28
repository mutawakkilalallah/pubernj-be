"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("penumpang", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      santri_uuid: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      dropspot_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      bus_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      jumlah_bayar: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      status_bayar: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["belum-lunas", "kurang", "lebih", "lunas"],
        defaultValue: "belum-lunas",
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
    await queryInterface.dropTable("penumpang");
  },
};
