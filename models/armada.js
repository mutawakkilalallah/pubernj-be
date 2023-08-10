"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Armada extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Armada.belongsTo(models.Dropspot, {
        as: "dropspot",
        foreignKey: "dropspot_id",
      });
      Armada.belongsTo(models.User, {
        as: "user",
        foreignKey: "user_uuid",
      });
      Armada.hasMany(models.Penumpang, {
        as: "penumpang",
        foreignKey: "armada_id",
      });
    }
  }
  Armada.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      dropspot_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Dropspot",
          key: "id",
        },
      },
      user_uuid: {
        allowNull: true,
        type: DataTypes.UUID,
        references: {
          model: "User",
          key: "uuid",
        },
      },
      nama: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ["bus", "minibus", "elf", "hiace", "mpv"],
      },
      jenis: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ["putri", "putra"],
      },
      harga: {
        allowNull: true,
        type: DataTypes.BIGINT,
        defaultValue: 0,
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
      modelName: "Armada",
      timestamps: true,
      tableName: "armada",
    }
  );
  return Armada;
};
