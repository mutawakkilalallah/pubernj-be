"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dropspot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Dropspot.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      area_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Area",
          key: "id",
        },
      },
      nama: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: [
          "by_negara",
          "by_provinsi",
          "by_kabupaten",
          "by_kecamatan",
          "by_desa",
        ],
      },
      cakupan: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      harga: {
        allowNull: false,
        type: DataTypes.INTEGER,
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
      modelName: "Dropspot",
      timestamps: true,
      tableName: "dropspot",
    }
  );
  return Dropspot;
};
