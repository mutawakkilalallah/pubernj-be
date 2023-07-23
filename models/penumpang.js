"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Penumpang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Penumpang.init(
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
      santri_niup: {
        allowNull: false,
        type: DataTypes.BIGINT,
      },
      santri_nama: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      santri_wilayah: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      santri_blok: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      blok_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      dropspot_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      bus_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      jumlah_bayar: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status_bayar: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ["belum-lunas", "kurang", "lebih", "lunas"],
        defaultValue: "belum-lunas",
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
      modelName: "Penumpang",
      timestamps: true,
      tableName: "penumpang",
    }
  );
  return Penumpang;
};
