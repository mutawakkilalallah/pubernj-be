require("dotenv").config();
const { Op } = require("sequelize");
const { Santri } = require("../../models");
const { API_PEDATREN_URL, API_PEDATREN_TOKEN } = process.env;
const axios = require("axios");
const responseHelper = require("../../helpers/response-helper");

module.exports = {
  // getAll: async (req, res) => {
  //   try {
  //     const search = req.query.cari || "";
  //     const page = parseInt(req.query.page) || 1;
  //     const limit = parseInt(req.query.limit) || 25;

  //     const data = await axios.get(API_PEDATREN_URL + "/santri", {
  //       headers: {
  //         "x-api-key": API_PEDATREN_TOKEN,
  //       },
  //       params: {
  //         page: page,
  //         limit: limit,
  //         cari: search,
  //         blok:
  //           req.role === "wilayah" || req.role === "daerah"
  //             ? req.blok_id
  //             : null,
  //       },
  //     });
  //     responseHelper.allDataWithPedatren(res, page, limit, data);
  //   } catch (err) {
  //     responseHelper.serverError(
  //       res,
  //       "Terjadi kesalahan saat koneksi ke PEDATREN"
  //     );
  //   }
  // },

  getAll: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      let whereCondition = {
        [Op.or]: {
          nama_lengkap: {
            [Op.like]: "%" + search + "%",
          },
          niup: {
            [Op.like]: "%" + search + "%",
          },
        },
        ...(req.role === "wilayah" && { blok_id: req.blok_id }),
      };

      const data = await Santri.findAndCountAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
      });

      data.rows.map((d) => {
        d.raw = JSON.parse(d.raw);
      });
      // const filterArea = await Area.findAll();

      responseHelper.allData(res, page, limit, data);
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  // getByUuid: async (req, res) => {
  //   try {
  //     const response = await axios.get(
  //       API_PEDATREN_URL + "/person/" + req.params.uuid,
  //       {
  //         headers: {
  //           "x-api-key": API_PEDATREN_TOKEN,
  //         },
  //       }
  //     );

  //     responseHelper.oneData(res, response.data);
  //   } catch (err) {
  //     responseHelper.serverError(
  //       res,
  //       "Terjadi kesalahan saat koneksi ke PEDATREN"
  //     );
  //   }
  // },

  getByUuid: async (req, res) => {
    try {
      const data = await Santri.findOne({
        where: {
          uuid: req.params.uuid,
        },
      });

      data.raw = JSON.parse(data.raw);

      data ? responseHelper.oneData(res, data) : responseHelper.notFound(res);
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
