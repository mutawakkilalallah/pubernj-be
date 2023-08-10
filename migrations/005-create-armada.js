"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("armada", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dropspot_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Dropspot",
          key: "id",
        },
      },
      user_uuid: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "User",
          key: "uuid",
        },
      },
      nama: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["bus", "mini_bus", "elf", "hiace", "mpv"],
      },
      jenis: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["putri", "putra"],
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
    await queryInterface.dropTable("armada");
  },
};
