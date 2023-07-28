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
      jenis_kelamin: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ["L", "P"],
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
      alias_wilayah: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      wilayah: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      id_blok: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      blok: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      status_kepulangan: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ["rombongan", "non-rombongan"],
        defaultValue: "non-rombongan",
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
      raw: {
        allowNull: false,
        type: DataTypes.TEXT,
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
