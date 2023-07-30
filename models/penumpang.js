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
      Penumpang.belongsTo(models.Armada, {
        as: "armada",
        foreignKey: "armada_id",
      });
      Penumpang.belongsTo(models.Santri, {
        as: "santri",
        foreignKey: "santri_uuid",
      });
      Penumpang.belongsTo(models.Dropspot, {
        as: "dropspot",
        foreignKey: "dropspot_id",
      });
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
        references: {
          model: "Santri",
          key: "uuid",
        },
      },
      dropspot_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "Dropspot",
          key: "id",
        },
      },
      armada_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "Armada",
          key: "id",
        },
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
