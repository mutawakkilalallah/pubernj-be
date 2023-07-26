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
      santri_niup: {
        allowNull: true,
        type: Sequelize.BIGINT,
      },
      santri_nama: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      santri_wilayah: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      santri_blok: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      blok_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("penumpang");
  },
};
