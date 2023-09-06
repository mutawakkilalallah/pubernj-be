const { Op } = require("sequelize");
const {
  Dropspot,
  Area,
  Penumpang,
  Armada,
  Santri,
  User,
  Periode,
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
          ...(req.role === "pendamping" && {
            user_uuid: req.uuid,
          }),
          ...(req.role === "p4nj" && { "$dropspot.area_id$": req.area }),
        },
        include: [
          {
            model: Dropspot,
            as: "dropspot",
            include: {
              model: Area,
              as: "area",
              where: {
                ...(req.query.area && { id: req.query.area }),
              },
            },
          },
          {
            model: User,
            as: "user",
          },
          {
            model: Penumpang,
            as: "penumpang",
          },
          {
            model: Periode,
            as: "periode",
            where: {
              is_active: true,
            },
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

      const area = await Area.findAll({
        where: {
          ...(req.role === "p4nj" && { id: req.area }),
        },
      });

      responseHelper.allData(req, res, page, limit, data, { area });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
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
        responseHelper.notFound(req, res);
      } else {
        data.dropspot.area.no_hp = `+62${data.dropspot.area.no_hp}`;
        if (data.user) {
          data.user.no_hp = `+62${data.user.no_hp}`;
        }
        responseHelper.oneData(req, res, data);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const { error, value } = armadaValidation.createAndUpdate.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(req, res, error.message);
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
        value.nama = `${value.type.toUpperCase()}-${value.jenis.toUpperCase()} ${
          drop.nama
        } ${value.nama}`;
        const periode = await Periode.findOne({
          where: {
            is_active: true,
          },
        });
        value.periode_id = periode.id;
        await Armada.create(value);

        responseHelper.createdOrUpdated(req, res);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
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
        responseHelper.notFound(req, res);
      } else {
        const { error, value } = armadaValidation.createAndUpdate.validate(
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

  updateSyncNama: async (req, res) => {
    try {
      const armada = await Armada.findAll({
        include: {
          model: Dropspot,
          as: "dropspot",
        },
      });

      const armadaByDropspot = {};
      armada.forEach((a) => {
        const dropspotId = a.dropspot.id;
        if (!armadaByDropspot[dropspotId]) {
          armadaByDropspot[dropspotId] = [];
        }
        armadaByDropspot[dropspotId].push(a);
      });

      const promises = [];
      let totalCounter = 0;
      for (const group of Object.values(armadaByDropspot)) {
        let counter = 1;
        for (const a of group) {
          try {
            const [numUpdated, updatedArmada] = await Armada.update(
              {
                nama: `${a.type.toUpperCase()}-${a.jenis.toUpperCase()} ${
                  a.dropspot.nama
                } ${counter}`,
              },
              {
                where: {
                  id: a.id,
                },
              }
            );
            console.log(updatedArmada);
            counter++;
            totalCounter++;
          } catch (error) {
            console.error(error.message);
          }
        }
        promises.push(Promise.all(group));
      }

      await Promise.all(promises);
      res.json("ok");
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
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
        responseHelper.notFound(req, res);
      } else {
        const { error, value } = armadaValidation.updatePendamping.validate(
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

  deletePendamping: async (req, res) => {
    try {
      const data = await Armada.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!data) {
        responseHelper.notFound(req, res);
      } else {
        await data.update({
          user_uuid: null,
        });

        responseHelper.createdOrUpdated(req, res);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
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
