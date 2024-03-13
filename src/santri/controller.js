require("dotenv").config();
const { Op } = require("sequelize");
const { sequelize } = require("../../models");
const { Santri, Penumpang, Periode, Persyaratan } = require("../../models");
const { API_PEDATREN_URL, API_PEDATREN_TOKEN } = process.env;
const axios = require("axios");
const responseHelper = require("../../helpers/response-helper");
const santriValidation = require("../../validations/santri-validation");

module.exports = {
  getAll: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const data = await Santri.findAndCountAll({
        attributes: { exclude: ["raw"] },
        where: {
          [Op.or]: [
            {
              nama_lengkap: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              niup: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
          ...(req.role === "daerah" && { id_blok: req.id_blok }),
          ...(req.role === "wilayah" && { alias_wilayah: req.wilayah }),
          ...(req.query.blok && {
            id_blok: req.query.blok,
          }),
          ...(req.query.wilayah && {
            alias_wilayah: req.query.wilayah,
          }),
          ...(req.query.jenis_kelamin && {
            jenis_kelamin: req.query.jenis_kelamin,
          }),
          ...(req.query.status_kepulangan && {
            status_kepulangan: req.query.status_kepulangan,
          }),
        },
        limit: limit,
        offset: offset,
        order: [["updated_at", "DESC"]],
      });

      responseHelper.allData(req, res, page, limit, data);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  getByUuid: async (req, res) => {
    try {
      const data = await Santri.findOne({
        where: {
          uuid: req.params.uuid,
        },
      });

      if (!data) {
        responseHelper.notFound(req, res);
      } else {
        data.raw = JSON.parse(data.raw);
        responseHelper.oneData(req, res, data);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  getByCard: async (req, res) => {
    try {
      const resp = await axios.get(API_PEDATREN_URL + "/person/card/" + req.params.card, {
        headers: {
          "x-api-key": API_PEDATREN_TOKEN,
        },
      });
      responseHelper.oneData(req, res, resp.data);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  getByNama: async (req, res) => {
    try {
      const params = {
        cari: req.query.cari,
        limit: req.query.limit,
        ...(req.role == "wilayah" && { wilayah: req.alias_wilayah_pedatren }),
        ...(req.role == "daerah" && { blok: req.id_blok }),
      };
      const resp = await axios.get(API_PEDATREN_URL + "/santri", {
        params,
        headers: {
          "x-api-key": API_PEDATREN_TOKEN,
        },
      });
      res.json(resp.data);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  getImage: async (req, res) => {
    try {
      const type = req.query.size;

      const santri = await axios.get(API_PEDATREN_URL + "/person/niup/" + req.params.niup, {
        headers: {
          "x-api-key": API_PEDATREN_TOKEN,
        },
      });

      if (type === "small") {
        const response = await axios.get(API_PEDATREN_URL + santri.data.fotodiri.small, {
          headers: {
            "x-api-key": API_PEDATREN_TOKEN,
          },
          responseType: "arraybuffer",
        });
        responseHelper.imageWithPedatren(req, res, response.data);
      } else if (type === "medium") {
        const response = await axios.get(API_PEDATREN_URL + santri.data.fotodiri.medium, {
          headers: {
            "x-api-key": API_PEDATREN_TOKEN,
          },
          responseType: "arraybuffer",
        });
        responseHelper.imageWithPedatren(req, res, response.data);
      } else {
        const response = await axios.get(API_PEDATREN_URL + santri.data.fotodiri.normal, {
          headers: {
            "x-api-key": API_PEDATREN_TOKEN,
          },
          responseType: "arraybuffer",
        });
        responseHelper.imageWithPedatren(req, res, response.data);
      }
    } catch (err) {
      responseHelper.serverError(
        req,
        res,
        // err.message
        "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  dafatarRombongan: async (req, res) => {
    try {
      const { error, value } = santriValidation.updateDropspot.validate(req.body);

      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        const data = await Penumpang.findOne({
          where: {
            santri_uuid: req.params.uuid,
          },
        });
        if (data) {
          responseHelper.badRequest(req, res, "santri sudah terdaftar di rombongan");
        } else {
          console.log("x");
          const response = await axios.get(API_PEDATREN_URL + "/person/" + req.params.uuid, {
            headers: {
              "x-api-key": API_PEDATREN_TOKEN,
            },
          });

          await Santri.create({
            uuid: response.data.uuid,
            niup: response.data.warga_pesantren.niup ? response.data.warga_pesantren.niup : null,
            nama_lengkap: response.data.nama_lengkap,
            jenis_kelamin: response.data.jenis_kelamin,
            negara: response.data.negara ? response.data.negara : null,
            provinsi: response.data.provinsi ? response.data.provinsi : null,
            kabupaten: response.data.kabupaten ? response.data.kabupaten : null,
            kecamatan: response.data.kecamatan ? response.data.kecamatan : null,
            wilayah: response.data.domisili_santri ? response.data.domisili_santri[response.data.domisili_santri.length - 1].wilayah : null,
            alias_wilayah: response.data.domisili_santri ? response.data.domisili_santri[response.data.domisili_santri.length - 1].wilayah.toLowerCase().replace(/ /g, "-") : null,
            blok: response.data.domisili_santri ? response.data.domisili_santri[response.data.domisili_santri.length - 1].blok : null,
            id_blok: response.data.domisili_santri ? response.data.domisili_santri[response.data.domisili_santri.length - 1].id_blok : null,
            raw: JSON.stringify(response.data),
          });

          const periode = await Periode.findOne({
            where: {
              is_active: true,
            },
          });
          const insertedpenumpang = await Penumpang.create({
            santri_uuid: req.params.uuid,
            dropspot_id: value.dropspot_id,
            periode_id: periode.id,
          });
          await Persyaratan.create({
            penumpang_id: insertedpenumpang.id,
          });
          responseHelper.createdOrUpdated(req, res);
        }
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  filterWilayah: async (req, res) => {
    try {
      let wilayah;
      if (req.role === "wilayah") {
        wilayah = await sequelize.query(`SELECT DISTINCT alias_wilayah, wilayah FROM santri WHERE alias_wilayah IS NOT NULL AND alias_wilayah =  '${req.wilayah}';`);
      } else if (req.role === "daerah") {
        wilayah = await sequelize.query(`SELECT DISTINCT alias_wilayah, wilayah, id_blok FROM santri WHERE alias_wilayah IS NOT NULL AND id_blok =  '${req.id_blok}';`);
      } else {
        wilayah = await sequelize.query(`SELECT DISTINCT alias_wilayah, wilayah FROM santri WHERE alias_wilayah IS NOT NULL;`);
      }
      res.json(wilayah[0]);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  filterBlok: async (req, res) => {
    try {
      let blok;
      if (req.role === "wilayah") {
        blok = await sequelize.query(`SELECT DISTINCT id_blok, blok FROM santri WHERE id_blok IS NOT NULL AND alias_wilayah = '${req.query.alias_wilayah}' AND alias_wilayah = '${req.wilayah}';`);
      } else if (req.role === "daerah") {
        blok = await sequelize.query(`SELECT DISTINCT id_blok, blok FROM santri WHERE id_blok IS NOT NULL AND alias_wilayah = '${req.query.alias_wilayah}' AND id_blok = '${req.id_blok}';`);
      } else {
        blok = await sequelize.query(`SELECT DISTINCT id_blok, blok FROM santri WHERE id_blok IS NOT NULL AND alias_wilayah = '${req.query.alias_wilayah}';`);
      }
      res.json(blok[0]);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
};
