"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      niup: {
        allowNull: true,
        type: DataTypes.BIGINT,
      },
      id_blok: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      alias_wilayah: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      area_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      blok: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      wilayah: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      area: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      nama_lengkap: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      role: {
        allowNull: false,
        values: [
          "sysadmin",
          "admin",
          "keuangan",
          "bps",
          "armada",
          "p4nj",
          "supervisor",
          "wilayah",
          "daerah",
          "pendamping",
        ],
        type: DataTypes.ENUM,
      },
      type: {
        allowNull: false,
        values: ["internal", "external"],
        type: DataTypes.ENUM,
      },
      no_hp: {
        allowNull: true,
        type: DataTypes.BIGINT,
      },
      is_login: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        field: "created_at",
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        field: "updated_at",
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      tableName: "user",
    }
  );
  return User;
};
