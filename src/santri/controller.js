require("dotenv").config();
const { Op } = require("sequelize");
const { sequelize } = require("../../models");
const { Santri } = require("../../models");
const { API_PEDATREN_URL, API_PEDATREN_TOKEN } = process.env;
const axios = require("axios");
const responseHelper = require("../../helpers/response-helper");

module.exports = {
  getAll: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      let whereCondition = {
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
      };

      const data = await Santri.findAndCountAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
        order: [["updated_at", "DESC"]],
      });

      responseHelper.allData(res, page, limit, data);
    } catch (err) {
      responseHelper.serverError(res, err.message);
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
        responseHelper.notFound(res);
      } else {
        data.raw = JSON.parse(data.raw);
        responseHelper.oneData(res, data);
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  getImage: async (req, res) => {
    try {
      const type = req.query.size;

      const santri = await axios.get(
        API_PEDATREN_URL + "/person/" + req.params.uuid,
        {
          headers: {
            "x-api-key": API_PEDATREN_TOKEN,
          },
        }
      );

      if (type === "small") {
        const response = await axios.get(
          API_PEDATREN_URL + santri.data.fotodiri.small,
          {
            headers: {
              "x-api-key": API_PEDATREN_TOKEN,
            },
            responseType: "arraybuffer",
          }
        );
        responseHelper.imageWithPedatren(res, response.data);
      } else if (type === "medium") {
        const response = await axios.get(
          API_PEDATREN_URL + santri.data.fotodiri.medium,
          {
            headers: {
              "x-api-key": API_PEDATREN_TOKEN,
            },
            responseType: "arraybuffer",
          }
        );
        responseHelper.imageWithPedatren(res, response.data);
      } else {
        const response = await axios.get(
          API_PEDATREN_URL + santri.data.fotodiri.normal,
          {
            headers: {
              "x-api-key": API_PEDATREN_TOKEN,
            },
            responseType: "arraybuffer",
          }
        );
        responseHelper.imageWithPedatren(res, response.data);
      }
    } catch (err) {
      responseHelper.serverError(
        res,
        "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },
};
