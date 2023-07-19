require("dotenv").config();
const { API_PEDATREN_URL, API_PEDATREN_TOKEN } = process.env;
const axios = require("axios");
const responseHelper = require("../../helpers/response-helper");

module.exports = {
  getAll: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 25;

      const data = await axios.get(API_PEDATREN_URL + "/santri", {
        headers: {
          "x-api-key": API_PEDATREN_TOKEN,
        },
        params: {
          page: page,
          limit: limit,
          cari: search,
          blok:
            req.role === "wilayah" || req.role === "daerah"
              ? req.blok_id
              : null,
        },
      });
      responseHelper.allDataWithPedatren(res, page, limit, data);
    } catch (err) {
      responseHelper.serverError(
        res,
        "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  getByUuid: async (req, res) => {
    try {
      const response = await axios.get(
        API_PEDATREN_URL + "/person/" + req.params.uuid,
        {
          headers: {
            "x-api-key": API_PEDATREN_TOKEN,
          },
        }
      );

      responseHelper.oneData(res, response.data);
    } catch (err) {
      responseHelper.serverError(
        res,
        "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },

  getImage: async (req, res) => {
    try {
      const santri = await axios.get(
        API_PEDATREN_URL + "/person/" + req.params.uuid,
        {
          headers: {
            "x-api-key": API_PEDATREN_TOKEN,
          },
        }
      );

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
    } catch (err) {
      responseHelper.serverError(
        res,
        "Terjadi kesalahan saat koneksi ke PEDATREN"
      );
    }
  },
};
