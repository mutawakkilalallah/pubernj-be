// const { Op } = require("sequelize");
const { sequelize } = require("../../models");
// const areaValidation = require("../../validations/area-validation");
const responseHelper = require("../../helpers/response-helper");
const logger = require("../../helpers/logger");

module.exports = {
  getAll: async (req, res) => {
    try {
      const keuanganByDropspot = await sequelize.query(`SELECT 
      d.nama AS nama_dropspot,
      jumlah_penumpang_total,
      jumlah_penumpang_putra,
      jumlah_penumpang_putri,
      harga * jumlah_penumpang_total AS total_jumlah_estimasi_pendapatan,
      harga * jumlah_penumpang_putra AS total_jumlah_estimasi_pendapatan_putra,
      harga * jumlah_penumpang_putri AS total_jumlah_estimasi_pendapatan_putri,
      total_jumlah_bayar,
      total_jumlah_bayar_putra,
      total_jumlah_bayar_putri
  FROM 
      dropspot d
  JOIN (
      SELECT 
          dropspot_id,
          COUNT(id) AS jumlah_penumpang_total,
          SUM(CASE WHEN s.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS jumlah_penumpang_putra,
          SUM(CASE WHEN s.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS jumlah_penumpang_putri,
          SUM(jumlah_bayar) AS total_jumlah_bayar,
          SUM(CASE WHEN s.jenis_kelamin = 'P' THEN jumlah_bayar ELSE 0 END) AS total_jumlah_bayar_putra,
          SUM(CASE WHEN s.jenis_kelamin = 'L' THEN jumlah_bayar ELSE 0 END) AS total_jumlah_bayar_putri
      FROM 
          penumpang
      JOIN 
          santri s ON penumpang.santri_uuid = s.uuid
      GROUP BY 
          dropspot_id
  ) p ON d.id = p.dropspot_id;
  `);

      const keuanganTotal = await sequelize.query(`SELECT 
    SUM(d.harga * jumlah_penumpang_total) AS total_jumlah_estimasi_pendapatan,
    SUM(d.harga * jumlah_penumpang_putra) AS total_jumlah_estimasi_pendapatan_putra,
    SUM(d.harga * jumlah_penumpang_putri) AS total_jumlah_estimasi_pendapatan_putri,
    SUM(total_jumlah_bayar) AS total_jumlah_bayar,
    SUM(total_jumlah_bayar_putra) AS total_jumlah_bayar_putra,
    SUM(total_jumlah_bayar_putri) AS total_jumlah_bayar_putri
FROM (
    SELECT 
        p.dropspot_id,
        COUNT(p.id) AS jumlah_penumpang_total,
        SUM(CASE WHEN s.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS jumlah_penumpang_putra,
        SUM(CASE WHEN s.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS jumlah_penumpang_putri,
        SUM(p.jumlah_bayar) AS total_jumlah_bayar,
        SUM(CASE WHEN s.jenis_kelamin = 'P' THEN p.jumlah_bayar ELSE 0 END) AS total_jumlah_bayar_putra,
        SUM(CASE WHEN s.jenis_kelamin = 'L' THEN p.jumlah_bayar ELSE 0 END) AS total_jumlah_bayar_putri
    FROM 
        penumpang p
    JOIN 
        santri s ON p.santri_uuid = s.uuid
    GROUP BY 
        p.dropspot_id
) AS subquery
JOIN 
    dropspot d ON subquery.dropspot_id = d.id;
`);

      logger.loggerSucces(req, 200);
      res.status(200).json({
        code: 200,
        message: "success get data keuangan",
        data: {
          keuanganTotal: keuanganTotal[0][0],
          keuanganByDropspot: keuanganByDropspot[0],
        },
      });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  // getById: async (req, res) => {
  //   try {
  //     const data = await Area.findOne({
  //       where: {
  //         id: req.params.id,
  //       },
  //     });
  //     if (!data) {
  //       responseHelper.notFound(req, res);
  //     } else {
  //       data.no_hp = `+62${data.no_hp}`;
  //       responseHelper.oneData(req, res, data);
  //     }
  //   } catch (err) {
  //     responseHelper.serverError(req, res, err.message);
  //   }
  // },

  // create: async (req, res) => {
  //   try {
  //     const { error, value } = areaValidation.createAndUpdate.validate(
  //       req.body
  //     );

  //     if (error) {
  //       responseHelper.badRequest(req, res, error.message);
  //     } else {
  //       await Area.create(value);

  //       responseHelper.createdOrUpdated(req, res);
  //     }
  //   } catch (err) {
  //     responseHelper.serverError(req, res, err.message);
  //   }
  // },

  // update: async (req, res) => {
  //   try {
  //     const data = await Area.findOne({
  //       where: {
  //         id: req.params.id,
  //       },
  //     });

  //     if (!data) {
  //       responseHelper.notFound(req, res);
  //     } else {
  //       const { error, value } = areaValidation.createAndUpdate.validate(
  //         req.body
  //       );
  //       if (error) {
  //         responseHelper.badRequest(req, res, error.message);
  //       } else {
  //         await data.update(value);

  //         responseHelper.createdOrUpdated(req, res);
  //       }
  //     }
  //   } catch (err) {
  //     responseHelper.serverError(req, res, err.message);
  //   }
  // },

  // destroy: async (req, res) => {
  //   try {
  //     const area = await Area.findOne({
  //       where: {
  //         id: req.params.id,
  //       },
  //     });

  //     if (!area) {
  //       responseHelper.notFound(req, res);
  //     } else {
  //       await area.destroy();

  //       responseHelper.deleted(req, res);
  //     }
  //   } catch (err) {
  //     responseHelper.serverError(req, res, err.message);
  //   }
  // },
};
