"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Berkas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //
    }
  }
  Berkas.init(
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
      type: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: [
          "keterangan-pindah-dropspot",
          "surat-pernyataan",
          "surat-kuasa",
          "berkas-pendukung",
        ],
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      path: {
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
      modelName: "Berkas",
      tableName: "berkas",
      timestamps: true,
    }
  );
  return Berkas;
};
