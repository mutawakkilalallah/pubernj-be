"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LogPedatren extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LogPedatren.belongsTo(models.User, {
        as: "user",
        foreignKey: "user_uuid",
      });
    }
  }
  LogPedatren.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_uuid: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "User",
          key: "uuid",
        },
      },
      message: {
        allowNull: true,
        type: DataTypes.STRING,
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
      modelName: "LogPedatren",
      timestamps: true,
      tableName: "log_pedatren",
    }
  );
  return LogPedatren;
};
