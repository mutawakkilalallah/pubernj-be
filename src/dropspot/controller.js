const { Op } = require("sequelize");
const { Dropspot, Area, Penumpang } = require("../../models");
const dropspotValidation = require("../../validations/dropspot-validation");
const responseHelper = require("../../helpers/response-helper");

Dropspot.belongsTo(Area, { as: "area", foreignKey: "area_id" });
Dropspot.belongsTo(Penumpang, { as: "penumpang", foreignKey: "id" });

module.exports = {
  getAll: async (req, res) => {
    try {
      const area = req.query.area;
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 200;
      const offset = 0 + (page - 1) * limit;

      const data = await Dropspot.findAndCountAll({
        where: {
          [Op.or]: {
            nama: {
              [Op.like]: "%" + search + "%",
            },
            cakupan: {
              [Op.like]: "%" + search + "%",
            },
          },
          area_id: area ? area : { [Op.not]: null },
        },
        include: ["area"],
        limit: limit,
        offset: offset,
      });

      const filterArea = await Area.findAll();

      responseHelper.allData(res, page, limit, data, { area: filterArea });
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  getById: async (req, res) => {
    try {
      const data = await Dropspot.findOne({
        where: {
          id: req.params.id,
        },
        include: ["area"],
      });

      data ? responseHelper.oneData(res, data) : responseHelper.notFound(res);
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const { error, value } = dropspotValidation.createAndUpdate.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(res, error.message);
      } else {
        await Dropspot.create(value);

        responseHelper.createdOrUpdated(res);
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const data = await Dropspot.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!data) {
        responseHelper.notFound(res);
      } else {
        const { error, value } = dropspotValidation.createAndUpdate.validate(
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
      const data = await Dropspot.findOne({
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
