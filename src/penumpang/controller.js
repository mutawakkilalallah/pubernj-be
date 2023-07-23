const { Op } = require("sequelize");
const { Penumpang, Area, Dropspot } = require("../../models");
// const dropspotValidation = require("../../validations/dropspot-validation");
const responseHelper = require("../../helpers/response-helper");

Penumpang.belongsTo(Dropspot, { as: "dropspot", foreignKey: "dropspot_id" });

module.exports = {
  getAll: async (req, res) => {
    try {
      const dropspot = req.query.dropspot;
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const data = await Penumpang.findAndCountAll({
        where: {
          [Op.or]: {
            santri_nama: {
              [Op.like]: "%" + search + "%",
            },
            santri_niup: {
              [Op.like]: "%" + search + "%",
            },
          },
          blok_id: req.role != "wilayah" ? { [Op.not]: null } : req.blok_id,
          dropspot_id: dropspot ? dropspot : { [Op.not]: null },
        },
        include: [
          {
            model: Dropspot,
            as: "dropspot",
            include: ["area"],
          },
        ],
        limit: limit,
        offset: offset,
      });

      const filterArea = await Area.findAll();
      const filterDropspot = await Dropspot.findAll();
      data.rows.map((d) => {
        d.raw = JSON.parse(d.raw);
      });

      responseHelper.allData(res, page, limit, data, { area: filterArea });
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },

  // getById: async (req, res) => {
  //   try {
  //     const data = await Dropspot.findOne({
  //       where: {
  //         id: req.params.id,
  //       },
  //       include: ["area"],
  //     });

  //     data ? responseHelper.oneData(res, data) : responseHelper.notFound(res);
  //   } catch (err) {
  //     responseHelper.serverError(res, err.message);
  //   }
  // },

  // create: async (req, res) => {
  //   try {
  //     const { error, value } = dropspotValidation.createAndUpdate.validate(
  //       req.body
  //     );

  //     if (error) {
  //       responseHelper.badRequest(res, error.message);
  //     } else {
  //       await Dropspot.create(value);

  //       responseHelper.createdOrUpdated(res);
  //     }
  //   } catch (err) {
  //     responseHelper.serverError(res, err.message);
  //   }
  // },

  // update: async (req, res) => {
  //   try {
  //     const data = await Dropspot.findOne({
  //       where: {
  //         id: req.params.id,
  //       },
  //     });

  //     if (!data) {
  //       responseHelper.notFound(res);
  //     } else {
  //       const { error, value } = dropspotValidation.createAndUpdate.validate(
  //         req.body
  //       );
  //       if (error) {
  //         responseHelper.badRequest(res, error.message);
  //       } else {
  //         await data.update(value);

  //         responseHelper.createdOrUpdated(res);
  //       }
  //     }
  //   } catch (err) {
  //     responseHelper.serverError(res, err.message);
  //   }
  // },

  // destroy: async (req, res) => {
  //   try {
  //     const data = await Dropspot.findOne({
  //       where: {
  //         id: req.params.id,
  //       },
  //     });

  //     if (!data) {
  //       responseHelper.notFound(res);
  //     } else {
  //       await data.destroy();

  //       responseHelper.deleted(res);
  //     }
  //   } catch (err) {
  //     responseHelper.serverError(res, err.message);
  //   }
  // },
};
