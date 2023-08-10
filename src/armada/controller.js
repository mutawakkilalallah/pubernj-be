const { Op, fn, col } = require("sequelize");
const {
  Dropspot,
  Area,
  Penumpang,
  Armada,
  Santri,
  User,
} = require("../../models");
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
          ...(req.query.jenis && { jenis: req.query.jenis }),
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
          {
            model: User,
            as: "user",
          },
        ],
        limit: limit,
        offset: offset,
        order: [["updated_at", "DESC"]],
      });

      data.rows.map((d) => {
        d.dropspot.area.no_hp = `+62${d.dropspot.area.no_hp}`;
        if (d.user) {
          d.user.no_hp = `+62${d.user.no_hp}`;
        }
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
            model: User,
            as: "user",
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
        if (data.user) {
          data.user.no_hp = `+62${data.user.no_hp}`;
        }
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
        const drop = await Dropspot.findOne({
          where: {
            id: value.dropspot_id,
          },
          include: {
            model: Area,
            as: "area",
          },
        });
        value.nama = `${value.type.toUpperCase()} ${drop.area.nama.toUpperCase()} ${
          value.nama
        }`;
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

  updatePendamping: async (req, res) => {
    try {
      const data = await Armada.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!data) {
        responseHelper.notFound(res);
      } else {
        const { error, value } = armadaValidation.updatePendamping.validate(
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

  deletePendamping: async (req, res) => {
    try {
      const data = await Armada.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!data) {
        responseHelper.notFound(res);
      } else {
        await data.update({
          user_uuid: null,
        });

        responseHelper.createdOrUpdated(res);
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
