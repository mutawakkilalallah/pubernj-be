"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    Example: await queryInterface.bulkInsert(
      "user",
      [
        {
          santri_uuid: "c147d05e-4de3-446e-bae9-ca1fa37cea1b",
          blok_id: null,
          username: "sysadmin",
          password:
            "$2a$12$VfGQr3OEKb5yFCsmawj6vu73X9aYLwOEA1d7S91lEo6xs5lpRSpRO", //sysadmin
          role: "sysadmin",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          santri_uuid: "8cca75a2-cd75-4ad1-a622-81e1616cc7a4",
          blok_id: 56,
          username: "wilayah",
          password:
            "$2a$12$Y.zBTjlzWKsvc39HFHYbrehC4k61DM3BmFSrpKwwtAE.fHysqm2jq", //wilayah
          role: "wilayah",
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
