"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Area.hasMany(models.Dropspot, { as: "dropspot", foreignKey: "id" });
    }
  }
  Area.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      pic: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      no_hp: {
        allowNull: false,
        type: DataTypes.BIGINT,
      },
      pic_ext: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      no_hp_ext: {
        allowNull: true,
        type: DataTypes.BIGINT,
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
      modelName: "Area",
      tableName: "area",
      timestamps: true,
    }
  );
  return Area;
};
