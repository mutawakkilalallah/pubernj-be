require("dotenv").config();
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User, Santri, Area } = require("../../models");
const userValidation = require("../../validations/user-validation");
const responseHelper = require("../../helpers/response-helper");
const axios = require("axios");
const { API_PEDATREN_URL, API_PEDATREN_TOKEN } = process.env;

module.exports = {
  getAll: async (req, res) => {
    try {
      const role = req.query.role;
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const data = await User.findAndCountAll({
        attributes: { exclude: ["password"] },
        where: {
          [Op.or]: [
            {
              username: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              nama_lengkap: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
          role: role ? role : { [Op.not]: null },
          ...(req.role != "sysadmin" && { role: { [Op.not]: "sysadmin" } }),
        },
        limit: limit,
        offset: offset,
        order: [["updated_at", "DESC"]],
      });

      const filterRole = [
        { key: "admin", value: "admin" },
        { key: "supervisor", value: "supervisor" },
        { key: "armada", value: "armada" },
        { key: "pendamping", value: "pendamping" },
        { key: "biktren", value: "biktren" },
        { key: "wilayah", value: "wilayah" },
        { key: "daerah", value: "daerah" },
        { key: "p4nj", value: "p4nj" },
      ];

      if (req.role === "sysadmin") {
        filterRole.push(
          { key: "sysadmin", value: "sysadmin" },
          { key: "keuangan", value: "keuangan" },
          { key: "bps", value: "bps" }
        );
      }

      responseHelper.allData(req, res, page, limit, data, { role: filterRole });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  getById: async (req, res) => {
    try {
      const data = await User.findOne({
        attributes: { exclude: ["password"] },
        where: {
          uuid: req.params.uuid,
        },
      });

      if (!data) {
        responseHelper.notFound(req, res);
      } else {
        responseHelper.oneData(req, res, data);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  getByNiup: async (req, res) => {
    try {
      const response = await axios.get(
        API_PEDATREN_URL + "/person/niup/" + req.params.niup,
        {
          headers: {
            "x-api-key": API_PEDATREN_TOKEN,
          },
        }
      );

      responseHelper.oneData(req, res, response.data);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  createInternal: async (req, res) => {
    try {
      const { error, value } = userValidation.createInternal.validate(req.body);
      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        const data = await User.findOne({
          where: {
            niup: value.niup,
          },
        });
        if (data) {
          responseHelper.badRequest(req, res, "data sudah terdaftar");
        } else {
          if (req.role != "sysadmin" && value.role === "keuangan") {
            responseHelper.forbidden(req, res);
          } else {
            const existsUsername = await User.findOne({
              where: {
                username: value.username,
              },
            });
            if (existsUsername) {
              responseHelper.badRequest(req, res, "username sudah ada");
            } else {
              const response = await axios.get(
                API_PEDATREN_URL + "/person/niup/" + value.niup,
                {
                  headers: {
                    "x-api-key": API_PEDATREN_TOKEN,
                  },
                }
              );

              value.password = await bcrypt.hash(value.password, 10);
              value.nama_lengkap = response.data.nama_lengkap;
              value.jenis_kelamin = response.data.jenis_kelamin;
              value.type = "internal";
              if (value.role === "daerah") {
                value.id_blok =
                  response.data.domisili_santri[
                    response.data.domisili_santri.length - 1
                  ].id_blok;
                value.blok =
                  response.data.domisili_santri[
                    response.data.domisili_santri.length - 1
                  ].blok;
              }
              if (value.role === "wilayah") {
                value.wilayah =
                  response.data.domisili_santri[
                    response.data.domisili_santri.length - 1
                  ].wilayah;
                value.alias_wilayah = response.data.domisili_santri[
                  response.data.domisili_santri.length - 1
                ].wilayah
                  .toLowerCase()
                  .replace(/ /g, "-");
              }
              if (value.role === "p4nj") {
                const area = await Area.findOne({
                  where: {
                    id: value.area_id,
                  },
                });
                value.area = area.nama;
              }
              if (value.role != "p4nj") {
                value.area_id = null;
              }

              await User.create(value);

              responseHelper.createdOrUpdated(req, res);
            }
          }
        }
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  createExternal: async (req, res) => {
    try {
      const { error, value } = userValidation.createExternal.validate(req.body);
      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        value.password = await bcrypt.hash(value.password, 10);
        value.type = "external";
        value.niup = null;
        if (value.role === "p4nj") {
          const area = await Area.findOne({
            where: {
              id: value.area_id,
            },
          });
          value.area = area.nama;
        }

        await User.create(value);

        responseHelper.createdOrUpdated(req, res);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          uuid: req.params.uuid,
        },
      });

      if (!user) {
        responseHelper.notFound(req, res);
      } else {
        const { error, value } = userValidation.update.validate(req.body);

        if (error) {
          responseHelper.badRequest(req, res, error.message);
        } else {
          if (value.role != "p4nj") {
            value.area_id = null;
          }
          await user.update(value);

          responseHelper.createdOrUpdated(req, res);
        }
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  updatePassword: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          uuid: req.params.uuid,
        },
      });

      if (!user) {
        responseHelper.notFound(req, res);
      } else {
        const { error, value } = userValidation.updatePassword.validate(
          req.body
        );

        if (error) {
          responseHelper.badRequest(req, res, error.message);
        } else {
          value.password = await bcrypt.hash(value.password, 10);

          await user.update(value);

          responseHelper.createdOrUpdated(req, res);
        }
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  setLogout: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          uuid: req.params.uuid,
        },
      });

      if (!user) {
        responseHelper.notFound(req, res);
      } else {
        await user.update({
          is_login: false,
        });
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  destroy: async (req, res) => {
    try {
      const data = await User.findOne({
        where: {
          uuid: req.params.uuid,
        },
      });

      if (!data) {
        responseHelper.notFound(req, res);
      } else {
        await data.destroy();

        responseHelper.deleted(req, res);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
};
