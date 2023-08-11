"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserActivity.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_lengkap: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      username: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      time: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      method: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      path: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      code: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      user_info: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      payload: {
        allowNull: true,
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
      modelName: "UserActivity",
      timestamps: true,
      tableName: "user_activity",
    }
  );
  return UserActivity;
};
