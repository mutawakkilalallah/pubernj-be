"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      niup: {
        allowNull: true,
        type: Sequelize.BIGINT,
      },
      id_blok: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      alias_wilayah: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      area_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      blok: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      wilayah: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      area: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      nama_lengkap: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      role: {
        allowNull: false,
        values: [
          "sysadmin",
          "admin",
          "keuangan",
          "armada",
          "p4nj",
          "supervisor",
          "wilayah",
          "daerah",
          "pendamping",
        ],
        type: Sequelize.ENUM,
      },
      type: {
        allowNull: false,
        values: ["internal", "external"],
        type: Sequelize.ENUM,
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
    await queryInterface.dropTable("user");
  },
};
