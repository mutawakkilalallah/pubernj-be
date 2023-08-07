"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    Example: await queryInterface.bulkInsert(
      "user",
      [
        {
          santri_uuid: "2097d5d4-7686-4a63-987e-80cf405c3fa8",
          username: "whoami",
          password:
            "$2a$12$k9fPDdabpHU6CPOOgwLqpOTC8y8zEDn.k/VvVOrbjIoQ.IcsVFH52",
          role: "sysadmin",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          santri_uuid: "8cca75a2-cd75-4ad1-a622-81e1616cc7a4",
          username: "sysadmin",
          password:
            "$2a$12$VfGQr3OEKb5yFCsmawj6vu73X9aYLwOEA1d7S91lEo6xs5lpRSpRO",
          role: "sysadmin",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", null, {});
  },
};
