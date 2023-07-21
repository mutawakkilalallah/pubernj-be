require("dotenv").config();
const { API_PEDATREN_URL, API_PEDATREN_TOKEN } = process.env;
const axios = require("axios");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User } = require("../../models");
const userValidation = require("../../validations/user-validation");
const responseHelper = require("../../helpers/response-helper");

// Dropspot.belongsTo(Area, { as: "area", foreignKey: "area_id" });

module.exports = {
  getAll: async (req, res) => {
    try {
      const role = req.query.role;
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const data = await User.findAndCountAll({
        where: {
          [Op.or]: {
            username: {
              [Op.like]: "%" + search + "%",
            },
          },
          role: role ? role : { [Op.not]: null },
        },
        limit: limit,
        offset: offset,
      });

      const filterRole = [
        { key: "sysadmin", value: "Sysadmin" },
        { key: "wilayah", value: "Wilayah" },
      ];

      responseHelper.allData(res, page, limit, data, { role: filterRole });
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  getById: async (req, res) => {
    try {
      const data = await User.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!data) {
        responseHelper.notFound(res);
      } else {
        const response = await axios.get(
          API_PEDATREN_URL + "/person/" + data.santri_uuid,
          {
            headers: {
              "x-api-key": API_PEDATREN_TOKEN,
            },
          }
        );

        responseHelper.oneDataWithPedatren(res, data, response.data);
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const { error, value } = userValidation.create.validate(req.body);

      if (error) {
        responseHelper.badRequest(res, error.message);
      } else {
        const data = await User.findOne({
          where: {
            santri_uuid: value.santri_uuid,
          },
        });
        if (data) {
          responseHelper.badRequest(res, "santri sudah terdaftar");
        } else {
          const response = await axios.get(
            API_PEDATREN_URL + "/person/" + value.santri_uuid,
            {
              headers: {
                "x-api-key": API_PEDATREN_TOKEN,
              },
            }
          );

          value.password = await bcrypt.hash(value.password, 10);
          if (value.role != "wilayah") {
            value.blok_id = null;
          } else {
            value.blok_id =
              response.data.domisili_santri[
                response.data.domisili_santri.length - 1
              ].id_blok;
          }

          await User.create(value);

          responseHelper.createdOrUpdated(res);
        }
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!user) {
        responseHelper.notFound(res);
      } else {
        const { error, value } = userValidation.update.validate(req.body);

        if (error) {
          responseHelper.badRequest(res, error.message);
        } else {
          const response = await axios.get(
            API_PEDATREN_URL + "/person/" + value.santri_uuid,
            {
              headers: {
                "x-api-key": API_PEDATREN_TOKEN,
              },
            }
          );
          if (value.role != "wilayah") {
            value.blok_id = null;
          } else {
            value.blok_id =
              response.data.domisili_santri[
                response.data.domisili_santri.length - 1
              ].id_blok;
          }

          await user.update(value);

          responseHelper.createdOrUpdated(res);
        }
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  updatePassword: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!user) {
        responseHelper.notFound(res);
      } else {
        const { error, value } = userValidation.updatePassword.validate(
          req.body
        );

        if (error) {
          responseHelper.badRequest(res, error.message);
        } else {
          value.password = await bcrypt.hash(value.password, 10);

          await user.update(value);

          responseHelper.createdOrUpdated(res);
        }
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  destroy: async (req, res) => {
    try {
      const data = await User.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!data) {
        responseHelper.notFound(res);
      } else {
        await data.destroy();

        responseHelper.deleted(res);
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },
};
