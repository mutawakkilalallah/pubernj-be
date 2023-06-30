const { Op } = require("sequelize");
const { Area } = require("../../models");
const areaValidation = require("../../validations/area-validation");
const responseHelper = require("../../helpers/response-helper");

module.exports = {
  getAll: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const areas = await Area.findAndCountAll({
        where: {
          [Op.and]: {
            nama: {
              [Op.like]: "%" + search + "%",
            },
          },
        },
        limit: limit,
        offset: offset,
      });

      responseHelper.allData(res, page, limit, areas);
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  getById: async (req, res) => {
    try {
      const data = await Area.findOne({
        where: {
          id: req.params.id,
        },
      });

      data ? responseHelper.oneData(res, data) : responseHelper.notFound(res);
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const { error, value } = areaValidation.createAndUpdate.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(res, error.message);
      } else {
        await Area.create(value);

        responseHelper.createdOrUpdated(res);
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const data = await Area.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!data) {
        responseHelper.notFound(res);
      } else {
        const { error, value } = areaValidation.createAndUpdate.validate(
          req.body
        );
        if (error) {
          responseHelper.badRequest(res, error.message);
        } else {
          await data.update(value);

          responseHelper.createdOrUpdated(res);
        }
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  destroy: async (req, res) => {
    try {
      const area = await Area.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!area) {
        responseHelper.notFound(res);
      } else {
        await area.destroy();

        responseHelper.deleted(res);
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },
};
