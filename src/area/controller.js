const { Op } = require("sequelize");
const { Area } = require("../../models");
const areaValidation = require("../../validations/area-validation");
const responseHelper = require("../../helpers/response-helper");

module.exports = {
  getAll: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 200;
      const offset = 0 + (page - 1) * limit;

      const data = await Area.findAndCountAll({
        where: {
          [Op.and]: {
            nama: {
              [Op.like]: `%${search}%`,
            },
          },
        },
        limit: limit,
        offset: offset,
        order: [["created_at", "ASC"]],
      });
      data.rows.map((d) => {
        d.no_hp = `+62${d.no_hp}`;
      });
      responseHelper.allData(req, res, page, limit, data);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  getById: async (req, res) => {
    try {
      const data = await Area.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!data) {
        responseHelper.notFound(req, res);
      } else {
        data.no_hp = `+62${data.no_hp}`;
        responseHelper.oneData(req, res, data);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const { error, value } = areaValidation.createAndUpdate.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        await Area.create(value);

        responseHelper.createdOrUpdated(req, res);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
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
        responseHelper.notFound(req, res);
      } else {
        const { error, value } = areaValidation.createAndUpdate.validate(
          req.body
        );
        if (error) {
          responseHelper.badRequest(req, res, error.message);
        } else {
          await data.update(value);

          responseHelper.createdOrUpdated(req, res);
        }
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
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
        responseHelper.notFound(req, res);
      } else {
        await area.destroy();

        responseHelper.deleted(req, res);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
};
