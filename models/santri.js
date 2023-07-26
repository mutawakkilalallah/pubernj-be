"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Santri extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Santri.init(
    {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      niup: {
        allowNull: true,
        type: DataTypes.BIGINT,
      },
      nama_lengkap: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      negara: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      provinsi: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      kabupaten: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      kecamatan: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      wilayah_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      blok_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      status_kepulangan: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ["tidak-pulang", "pulang-rombongan"],
        defaultValue: "tidak-pulang",
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
      modelName: "Santri",
      timestamps: true,
      tableName: "santri",
    }
  );
  return Santri;
};
