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
        allowNull: true,
        type: Sequelize.BIGINT,
      },
      nama_lengkap: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      jenis_kelamin: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["L", "P"],
      },
      negara: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      provinsi: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      kabupaten: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      kecamatan: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      alias_wilayah: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      wilayah: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      id_blok: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      blok: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status_kepulangan: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["rombongan", "non-rombongan"],
        defaultValue: "non-rombongan",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      raw: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("santri");
  },
};
