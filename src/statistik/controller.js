const { sequelize } = require("../../models");
const responseHelper = require("../../helpers/response-helper");
const logger = require("../../helpers/logger");

module.exports = {
  getAll: async (req, res) => {
    try {
      const estArmada = await sequelize.query(`SELECT
      ds.id,
      ds.nama AS nama_dropspot,
      bus_putra,
      minibus_putra,
      elf_putra,
      hiace_putra,
      mpv_putra,
      bus_putri,
      minibus_putri,
      elf_putri,
      hiace_putri,
      mpv_putri,
      COALESCE(SUM(CASE WHEN s.jenis_kelamin = 'L' AND p.mahrom_id IS NULL THEN 1 ELSE 0 END), 0) AS total_putra,
      COALESCE(SUM(CASE WHEN s.jenis_kelamin = 'P' OR s.jenis_kelamin = 'L' AND p.mahrom_id IS NOT NULL  THEN 1 ELSE 0 END), 0) AS total_putri,
      COALESCE(SUM(CASE WHEN s.jenis_kelamin = 'L' OR s.jenis_kelamin = 'P' THEN 1 ELSE 0 END), 0) AS total_penumpang
  FROM
      dropspot ds
  LEFT JOIN
      (
          SELECT
              dropspot_id,
              SUM(CASE WHEN type = 'bus' AND jenis = 'putra' THEN 1 ELSE 0 END) AS bus_putra,
              SUM(CASE WHEN type = 'minibus' AND jenis = 'putra' THEN 1 ELSE 0 END) AS minibus_putra,
              SUM(CASE WHEN type = 'elf' AND jenis = 'putra' THEN 1 ELSE 0 END) AS elf_putra,
              SUM(CASE WHEN type = 'hiace' AND jenis = 'putra' THEN 1 ELSE 0 END) AS hiace_putra,
              SUM(CASE WHEN type = 'mpv' AND jenis = 'putra' THEN 1 ELSE 0 END) AS mpv_putra,
              SUM(CASE WHEN type = 'bus' AND jenis = 'putri' THEN 1 ELSE 0 END) AS bus_putri,
              SUM(CASE WHEN type = 'minibus' AND jenis = 'putri' THEN 1 ELSE 0 END) AS minibus_putri,
              SUM(CASE WHEN type = 'elf' AND jenis = 'putri' THEN 1 ELSE 0 END) AS elf_putri,
              SUM(CASE WHEN type = 'hiace' AND jenis = 'putri' THEN 1 ELSE 0 END) AS hiace_putri,
              SUM(CASE WHEN type = 'mpv' AND jenis = 'putri' THEN 1 ELSE 0 END) AS mpv_putri
          FROM armada
          GROUP BY dropspot_id
      ) a ON ds.id = a.dropspot_id
  LEFT JOIN
      penumpang p ON ds.id = p.dropspot_id
  LEFT JOIN
      santri s ON p.santri_uuid = s.uuid
  GROUP BY
      ds.id, ds.nama, bus_putra, minibus_putra, elf_putra, hiace_putra, mpv_putra, bus_putri, minibus_putri, elf_putri, hiace_putri, mpv_putri
  ORDER BY
      ds.id;`);
      res.status(200).json({
        code: 200,
        message: "success get data keuangan",
        data: {
          estArmada: estArmada[0],
        },
      });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
  keuangan: async (req, res) => {
    try {
      const keuanganByDp = await sequelize.query(`SELECT
      ds.nama AS nama_dropspot,
      COALESCE(total_putra, 0) AS total_putra,
      COALESCE(total_putri, 0) AS total_putri,
      COALESCE(total_putra_putri, 0) AS total_putra_putri,
      COALESCE(bayar_putra, 0) AS bayar_putra,
      COALESCE(bayar_putri, 0) AS bayar_putri,
      COALESCE(bayar_putra_putri, 0) AS bayar_putra_putri,
      COALESCE(pendapatan_putra, 0) AS pendapatan_putra,
      COALESCE(pendapatan_putri, 0) AS pendapatan_putri,
      COALESCE(pendapatan_putra_putri, 0) AS pendapatan_putra_putri,
      COALESCE(ongkos_putra_putri, 0) AS ongkos_putra_putri,
      COALESCE(ongkos_putra, 0) AS ongkos_putra,
      COALESCE(ongkos_putri, 0) AS ongkos_putri,
      pendapatan_putra_putri - COALESCE(ongkos_putra_putri, 0) AS laba_putra_putri,
      pendapatan_putra - COALESCE(ongkos_putra, 0) AS laba_putra,
      pendapatan_putri - COALESCE(ongkos_putri, 0) AS laba_putri,
      bayar_putra_putri - COALESCE(ongkos_putra_putri, 0) AS pra_laba_putra_putri,
      bayar_putra - COALESCE(ongkos_putra, 0) AS pra_laba_putra,
      bayar_putri - COALESCE(ongkos_putri, 0) AS pra_laba_putri
  FROM
      dropspot ds
  LEFT JOIN (
      SELECT
          d.id AS dropspot_id,
          SUM(CASE WHEN s.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS total_putra,
          SUM(CASE WHEN s.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS total_putri,
          COUNT(*) AS total_putra_putri
      FROM
          penumpang p
      JOIN
          santri s ON p.santri_uuid = s.uuid
      JOIN
          dropspot d ON p.dropspot_id = d.id
      GROUP BY
          d.id
  ) total ON ds.id = total.dropspot_id
  LEFT JOIN (
      SELECT
          d.id AS dropspot_id,
          SUM(CASE WHEN s.jenis_kelamin = 'L' THEN p.jumlah_bayar ELSE 0 END) AS bayar_putra,
          SUM(CASE WHEN s.jenis_kelamin = 'P' THEN p.jumlah_bayar ELSE 0 END) AS bayar_putri,
          SUM(p.jumlah_bayar) AS bayar_putra_putri
      FROM
          penumpang p
      JOIN
          santri s ON p.santri_uuid = s.uuid
      JOIN
          dropspot d ON p.dropspot_id = d.id
      GROUP BY
          d.id
  ) estimasi_bayar ON ds.id = estimasi_bayar.dropspot_id
  LEFT JOIN (
      SELECT
          d.id AS dropspot_id,
          SUM(CASE WHEN s.jenis_kelamin = 'L' THEN d.harga ELSE 0 END) AS pendapatan_putra,
          SUM(CASE WHEN s.jenis_kelamin = 'P' THEN d.harga ELSE 0 END) AS pendapatan_putri,
          SUM(d.harga) AS pendapatan_putra_putri
      FROM
          penumpang p
      JOIN
          santri s ON p.santri_uuid = s.uuid
      JOIN
          dropspot d ON p.dropspot_id = d.id
      GROUP BY
          d.id
  ) pendapatan ON ds.id = pendapatan.dropspot_id
  LEFT JOIN (
      SELECT
          d.id AS dropspot_id,
          COALESCE(SUM(CASE WHEN a.jenis = 'putra' OR a.jenis = 'putri' THEN a.harga ELSE 0 END), 0) AS ongkos_putra_putri,
          COALESCE(SUM(CASE WHEN a.jenis = 'putra' THEN a.harga ELSE 0 END), 0) AS ongkos_putra,
          COALESCE(SUM(CASE WHEN a.jenis = 'putri' THEN a.harga ELSE 0 END), 0) AS ongkos_putri
      FROM
          armada a
      JOIN
          dropspot d ON a.dropspot_id = d.id
      GROUP BY
          d.id
  ) ongkos ON ds.id = ongkos.dropspot_id;`);
      const keuanganAll = await sequelize.query(`SELECT
      'Total' AS nama_dropspot,
      SUM(putra) AS putra,
      SUM(putri) AS putri,
      SUM(putra_putri) AS putra_putri,
      SUM(estimasi_bayar_putra) AS estimasi_bayar_putra,
      SUM(estimasi_bayar_putri) AS estimasi_bayar_putri,
      SUM(estimasi_bayar_putra_putri) AS estimasi_bayar_putra_putri,
      SUM(pendapatan_putra) AS pendapatan_putra,
      SUM(pendapatan_putri) AS pendapatan_putri,
      SUM(pendapatan_putra_putri) AS pendapatan_putra_putri,
      SUM(ongkos_putra_putri) AS ongkos_putra_putri,
      SUM(ongkos_putra) AS ongkos_putra,
      SUM(ongkos_putri) AS ongkos_putri,
      SUM(laba_putra_putri) AS laba_putra_putri,
      SUM(laba_putra) AS laba_putra,
      SUM(laba_putri) AS laba_putri,
      SUM(pra_laba_putra_putri) AS pra_laba_putra_putri,
      SUM(pra_laba_putra) AS pra_laba_putra,
      SUM(pra_laba_putri) AS pra_laba_putri
  FROM (
      SELECT
          ds.nama AS nama_dropspot,
          COALESCE(putra, 0) AS putra,
          COALESCE(putri, 0) AS putri,
          COALESCE(putra_putri, 0) AS putra_putri,
          COALESCE(estimasi_bayar_putra, 0) AS estimasi_bayar_putra,
          COALESCE(estimasi_bayar_putri, 0) AS estimasi_bayar_putri,
          COALESCE(estimasi_bayar_putra_putri, 0) AS estimasi_bayar_putra_putri,
          COALESCE(pendapatan_putra, 0) AS pendapatan_putra,
          COALESCE(pendapatan_putri, 0) AS pendapatan_putri,
          COALESCE(pendapatan_putra_putri, 0) AS pendapatan_putra_putri,
          COALESCE(ongkos_putra_putri, 0) AS ongkos_putra_putri,
          COALESCE(ongkos_putra, 0) AS ongkos_putra,
          COALESCE(ongkos_putri, 0) AS ongkos_putri,
          pendapatan_putra_putri - COALESCE(ongkos_putra_putri, 0) AS laba_putra_putri,
          pendapatan_putra - COALESCE(ongkos_putra, 0) AS laba_putra,
          pendapatan_putri - COALESCE(ongkos_putri, 0) AS laba_putri,
          estimasi_bayar_putra_putri - COALESCE(ongkos_putra_putri, 0) AS pra_laba_putra_putri,
          estimasi_bayar_putra - COALESCE(ongkos_putra, 0) AS pra_laba_putra,
          estimasi_bayar_putri - COALESCE(ongkos_putri, 0) AS pra_laba_putri
      FROM
          dropspot ds
      LEFT JOIN (
          SELECT
              d.id AS dropspot_id,
              SUM(CASE WHEN s.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS putra,
              SUM(CASE WHEN s.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS putri,
              COUNT(*) AS putra_putri
          FROM
              penumpang p
          JOIN
              santri s ON p.santri_uuid = s.uuid
          JOIN
              dropspot d ON p.dropspot_id = d.id
          GROUP BY
              d.id
      ) total ON ds.id = total.dropspot_id
      LEFT JOIN (
          SELECT
              d.id AS dropspot_id,
              SUM(CASE WHEN s.jenis_kelamin = 'L' THEN p.jumlah_bayar ELSE 0 END) AS estimasi_bayar_putra,
              SUM(CASE WHEN s.jenis_kelamin = 'P' THEN p.jumlah_bayar ELSE 0 END) AS estimasi_bayar_putri,
              SUM(p.jumlah_bayar) AS estimasi_bayar_putra_putri
          FROM
              penumpang p
          JOIN
              santri s ON p.santri_uuid = s.uuid
          JOIN
              dropspot d ON p.dropspot_id = d.id
          GROUP BY
              d.id
      ) estimasi_bayar ON ds.id = estimasi_bayar.dropspot_id
      LEFT JOIN (
          SELECT
              d.id AS dropspot_id,
              SUM(CASE WHEN s.jenis_kelamin = 'L' THEN d.harga ELSE 0 END) AS pendapatan_putra,
              SUM(CASE WHEN s.jenis_kelamin = 'P' THEN d.harga ELSE 0 END) AS pendapatan_putri,
              SUM(d.harga) AS pendapatan_putra_putri
          FROM
              penumpang p
          JOIN
              santri s ON p.santri_uuid = s.uuid
          JOIN
              dropspot d ON p.dropspot_id = d.id
          GROUP BY
              d.id
      ) pendapatan ON ds.id = pendapatan.dropspot_id
      LEFT JOIN (
          SELECT
              d.id AS dropspot_id,
              COALESCE(SUM(CASE WHEN a.jenis = 'putra' OR a.jenis = 'putri' THEN a.harga ELSE 0 END), 0) AS ongkos_putra_putri,
              COALESCE(SUM(CASE WHEN a.jenis = 'putra' THEN a.harga ELSE 0 END), 0) AS ongkos_putra,
              COALESCE(SUM(CASE WHEN a.jenis = 'putri' THEN a.harga ELSE 0 END), 0) AS ongkos_putri
          FROM
              armada a
          JOIN
              dropspot d ON a.dropspot_id = d.id
          GROUP BY
              d.id
      ) ongkos ON ds.id = ongkos.dropspot_id
  ) total_data;
  `);

      logger.loggerSucces(req, 200);
      res.status(200).json({
        code: 200,
        message: "success get data keuangan",
        data: {
          keuanganAll: keuanganAll[0][0],
          keuanganByDp: keuanganByDp[0],
        },
      });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
};
