require("dotenv").config();
const {
  Santri,
  Penumpang,
  Area,
  Dropspot,
  User,
  Armada,
  sequelize,
} = require("../../models");
const responseHelper = require("../../helpers/response-helper");
const logger = require("../../helpers/logger");

// Relasi antara model
Dropspot.hasMany(Penumpang, { foreignKey: "dropspot_id" });
Penumpang.belongsTo(Santri, { foreignKey: "santri_uuid" });

module.exports = {
  index: async (req, res) => {
    try {
      whereCondition = {};

      if (req.role === "daerah") {
        whereCondition = {
          id_blok: req.id_blok,
        };
      } else if (req.role === "wilayah") {
        whereCondition = {
          alias_wilayah: req.wilayah,
        };
      }

      const totalSantri = await Santri.count({
        where: whereCondition,
      });
      const totalPenumpang = await Penumpang.count({
        where: {
          ...(req.role === "pendamping" && {
            "$armada.user_uuid$": req.uuid,
          }),
          ...(req.role === "p4nj" && {
            "$dropspot.area_id$": req.area,
          }),
        },
        include: [
          {
            model: Santri,
            as: "santri",
            where: whereCondition,
          },
          {
            model: Armada,
            as: "armada",
          },
          {
            model: Dropspot,
            as: "dropspot",
          },
        ],
      });
      const totalTidakRombongan = totalSantri - totalPenumpang;
      const totalArea = await Area.count();
      const totalDropspot = await Dropspot.count();
      const totalArmada = await Armada.count({
        where: {
          ...(req.role === "pendamping" && {
            user_uuid: req.uuid,
          }),
          ...(req.role === "p4nj" && { "$dropspot.area_id$": req.area }),
        },
        include: [
          {
            model: Dropspot,
            as: "dropspot",
          },
        ],
      });
      const totalUser = await User.count();

      const statDrop = await sequelize.query(`SELECT 
          ds.id AS dropspot_id,
          ds.nama AS dropspot_nama,
          SUM(CASE WHEN s.jenis_kelamin = 'L' THEN 1 ELSE 0 END) + SUM(CASE WHEN s.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS total_penumpang_putra_putri,
          SUM(CASE WHEN s.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS total_penumpang_putra,
          SUM(CASE WHEN s.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS total_penumpang_putri
      FROM 
          dropspot ds
      LEFT JOIN 
          penumpang p ON ds.id = p.dropspot_id
      LEFT JOIN 
          santri s ON p.santri_uuid = s.uuid
      GROUP BY 
          ds.id, ds.nama
          ORDER BY total_penumpang_putra_putri DESC
      LIMIT 10
      `);

      const kolom = [
        "dropspot_nama",
        "total_penumpang_putra_putri",
        "total_penumpang_putra",
        "total_penumpang_putri",
      ];
      const dataHasil = [kolom];
      const truncateString = (str, maxLength) =>
        str.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str;
      statDrop[0].forEach((item) => {
        dataHasil.push([
          truncateString(item["dropspot_nama"], 20),
          parseInt(item["total_penumpang_putra_putri"]),
          parseInt(item["total_penumpang_putra"]),
          parseInt(item["total_penumpang_putri"]),
        ]);
      });

      logger.loggerSucces(req, 200);
      res.status(200).json({
        code: 200,
        message: "Berhasil mendapatkan semua data",
        data: {
          counter: {
            totalSantri,
            totalPenumpang,
            totalTidakRombongan,
            totalArea,
            totalDropspot,
            totalUser,
            totalArmada,
          },
          stat: dataHasil,
        },
      });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
};
