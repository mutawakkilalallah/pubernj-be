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
      Dropspot.belongsTo(models.Area, { as: "area", foreignKey: "area_id" });
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
      cakupan: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      harga: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      jam_berangkat_pa: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      jam_berangkat_pi: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      grup: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ["jatim", "jawa-non-jatim", "luar-jawa", "luar-pulau"],
      },
      is_active: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
