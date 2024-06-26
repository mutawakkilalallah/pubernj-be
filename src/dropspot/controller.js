const { Op } = require("sequelize");
const { Dropspot, Area, Penumpang } = require("../../models");
const dropspotValidation = require("../../validations/dropspot-validation");
const responseHelper = require("../../helpers/response-helper");

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
          ...(req.query.area && { area_id: req.query.area }),
          ...(req.query.grup && { grup: req.query.grup }),
        },
        include: {
          model: Area,
          as: "area",
        },
        limit: limit,
        offset: offset,
        order: [["harga", "ASC"]],
      });

      const filterArea = await Area.findAll({
        include: "dropspot",
      });

      data.rows.map((d) => {
        d.area.no_hp = `+62${d.area.no_hp}`;
      });
      filterArea.map((fA) => {
        fA.no_hp = `+62${fA.no_hp}`;
      });

      responseHelper.allData(req, res, page, limit, data, { area: filterArea });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
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
      data.area.no_hp = `+62${data.area.no_hp}`;
      data
        ? responseHelper.oneData(req, res, data)
        : responseHelper.notFound(req, res);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const { error, value } = dropspotValidation.createAndUpdate.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        await Dropspot.create(value);

        responseHelper.createdOrUpdated(req, res);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
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
        responseHelper.notFound(req, res);
      } else {
        const { error, value } = dropspotValidation.createAndUpdate.validate(
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
      const data = await Dropspot.findOne({
        where: {
          id: req.params.id,
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
