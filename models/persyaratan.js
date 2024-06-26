"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Persyaratan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Persyaratan.belongsTo(models.Penumpang, {
        as: "penumpang",
        foreignKey: "id",
      });
    }
  }
  Persyaratan.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      penumpang_id: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: "Penumpang",
          key: "id",
        },
      },
      lunas_bps: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lunas_kosmara: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      tuntas_fa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bebas_kamtib: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_izin: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["Y", "T"],
        defaultValue: "T",
      },
      is_konfirmasi: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["Y", "T"],
        defaultValue: "T",
      },
      is_cetak: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["Y", "T"],
        defaultValue: "T",
      },
      is_dispen_bps: {
        type: DataTypes.ENUM,
        allowNull: true,
        values: ["Y", "T"],
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
      modelName: "Persyaratan",
      tableName: "persyaratan",
      timestamps: true,
    }
  );
  return Persyaratan;
};
