const { Op } = require("sequelize");
const {
  Penumpang,
  Area,
  Dropspot,
  Santri,
  sequelize,
} = require("../../models");
// const dropspotValidation = require("../../validations/dropspot-validation");
const responseHelper = require("../../helpers/response-helper");

Penumpang.belongsTo(Dropspot, { as: "dropspot", foreignKey: "dropspot_id" });
Penumpang.belongsTo(Santri, { as: "santri", foreignKey: "santri_uuid" });

module.exports = {
  getAll: async (req, res) => {
    try {
      // const dropspot = req.query.dropspot;
      const search = req.query.cari || "";
      const page = req.query.page || 1;
      const limit = parseInt(req.query.limit) || 25;
      const offset = 0 + (page - 1) * limit;

      const data = await Penumpang.findAndCountAll({
        where: {
          [Op.or]: [
            {
              "$santri.niup$": {
                [Op.like]: `%${search}%`,
              },
            },
            {
              "$santri.nama_lengkap$": {
                [Op.like]: `%${search}%`,
              },
            },
          ],
          ...(req.query.dropspot && { dropspot_id: req.query.dropspot }),
          ...(req.query.area && { "$dropspot.area_id$": req.query.area }),
          ...(req.role === "daerah" && {
            "$santri.id_blok$": req.id_blok,
          }),
          ...(req.role === "wilayah" && {
            "$santri.alias_wilayah$": req.wilayah,
          }),
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
            model: Santri,
            as: "santri",
            attributes: { exclude: ["raw"] },
          },
        ],
        limit: limit,
        offset: offset,
      });

      const filterArea = await Area.findAll();

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
