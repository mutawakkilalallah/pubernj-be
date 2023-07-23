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
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      santri_uuid: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      santri_nama: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      blok_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
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
        values: ["sysadmin", "admin", "wilayah"],
        type: DataTypes.ENUM,
      },
      raw: {
        allowNull: false,
        type: DataTypes.TEXT,
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
