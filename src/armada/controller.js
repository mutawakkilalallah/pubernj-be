const { Op, fn, col } = require("sequelize");
const { Dropspot, Area, Penumpang, Armada, Santri } = require("../../models");
const armadaValidation = require("../../validations/armada-validation");
const responseHelper = require("../../helpers/response-helper");

module.exports = {
  getAll: async (req, res) => {
    try {
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 200;
      const offset = 0 + (page - 1) * limit;

      const data = await Armada.findAndCountAll({
        where: {
          [Op.or]: {
            nama: {
              [Op.like]: "%" + search + "%",
            },
          },
          ...(req.query.type && { type: req.query.type }),
          ...(req.query.dropspot && { dropspot_id: req.query.dropspot }),
          ...(req.query.area && { "$dropspot.area_id$": req.query.area }),
        },
        include: [
          {
            model: Dropspot,
            as: "dropspot",
            include: {
              model: Area,
              as: "area",
            },
          },
        ],
        limit: limit,
        offset: offset,
        order: [["updated_at", "DESC"]],
      });

      data.rows.map((d) => {
        d.dropspot.area.no_hp = `+62${d.dropspot.area.no_hp}`;
      });

      const area = await Area.findAll();

      responseHelper.allData(res, page, limit, data, { area });
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  getById: async (req, res) => {
    try {
      const data = await Armada.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: Dropspot,
            as: "dropspot",
            include: {
              model: Area,
              as: "area",
            },
          },
          {
            model: Penumpang,
            as: "penumpang",
            include: [
              {
                model: Santri,
                as: "santri",
                attributes: { exclude: ["raw"] },
              },
              {
                model: Dropspot,
                as: "dropspot",
              },
            ],
          },
        ],
      });
      if (!data) {
        responseHelper.notFound(res);
      } else {
        data.dropspot.area.no_hp = `+62${data.dropspot.area.no_hp}`;
        responseHelper.oneData(res, data);
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const { error, value } = armadaValidation.createAndUpdate.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(res, error.message);
      } else {
        await Armada.create(value);

        responseHelper.createdOrUpdated(res);
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const data = await Armada.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!data) {
        responseHelper.notFound(res);
      } else {
        const { error, value } = armadaValidation.createAndUpdate.validate(
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
      const data = await Armada.findOne({
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