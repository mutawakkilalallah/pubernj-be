const { Op } = require("sequelize");
const {
  Penumpang,
  Area,
  Dropspot,
  Santri,
  Armada,
  User,
} = require("../../models");
const penumpangValidation = require("../../validations/penumpang-validation");
const responseHelper = require("../../helpers/response-helper");

module.exports = {
  getAll: async (req, res) => {
    try {
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
          ...(req.query.armada === "n" && {
            armada_id: {
              [Op.is]: null,
            },
          }),
          ...(req.query.pembayaran && {
            $status_bayar$: req.query.pembayaran,
          }),
          ...(req.query.jenis_kelamin && {
            "$santri.jenis_kelamin$": req.query.jenis_kelamin,
          }),
          ...(req.query.dropspot && { dropspot_id: req.query.dropspot }),
          ...(req.query.area && { "$dropspot.area_id$": req.query.area }),
          ...(req.query.blok && {
            "$santri.id_blok$": req.query.blok,
          }),
          ...(req.query.wilayah && {
            "$santri.alias_wilayah$": req.query.wilayah,
          }),
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
        order: [["updated_at", "DESC"]],
      });

      const filterArea = await Area.findAll();
      data.rows.map((d) => {
        if (d.dropspot) {
          d.dropspot.area.no_hp = `+62${d.dropspot.area.no_hp}`;
        }
      });
      responseHelper.allData(req, res, page, limit, data, { area: filterArea });
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  getByUuid: async (req, res) => {
    try {
      const data = await Penumpang.findOne({
        where: {
          santri_uuid: req.params.uuid,
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
            model: Armada,
            as: "armada",
            include: {
              model: User,
              as: "user",
            },
          },
          {
            model: Santri,
            as: "santri",
          },
        ],
      });
      if (!data) {
        responseHelper.notFound(req, res);
      } else {
        if (data.dropspot) {
          data.dropspot.area.no_hp = `+62${data.dropspot.area.no_hp}`;
        }
        if (data.armada) {
          if (data.armada.user) {
            data.armada.user.no_hp = `+62${data.armada.user.no_hp}`;
          }
        }
        data.santri.raw = JSON.parse(data.santri.raw);
        responseHelper.oneData(req, res, data);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  updateArmada: async (req, res) => {
    try {
      const { error, value } = penumpangValidation.updateArmada.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        await Penumpang.update(
          {
            armada_id: req.params.id,
          },
          {
            where: {
              id: value.id_penumpang,
            },
          }
        );

        responseHelper.createdOrUpdated(req, res);
      }
      // }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  deleteArmada: async (req, res) => {
    try {
      const { error, value } = penumpangValidation.updateArmada.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        await Penumpang.update(
          {
            armada_id: null,
          },
          {
            where: {
              id: value.id_penumpang,
            },
          }
        );

        responseHelper.createdOrUpdated(req, res);
      }
      // }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  updateDropspot: async (req, res) => {
    try {
      const { error, value } = penumpangValidation.updateDropspot.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        const penumpang = await Penumpang.findOne({
          where: {
            id: req.params.id,
          },
        });
        if (penumpang.armada_id != null) {
          responseHelper.badRequest(
            req,
            res,
            "penumpang ini sudah dimasukkan ke dalam armada"
          );
        } else {
          await penumpang.update({
            dropspot_id: value.dropspot_id,
          });
          responseHelper.createdOrUpdated(req, res);
        }
      }
      // }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  deleteRombongan: async (req, res) => {
    try {
      const data = await Penumpang.findOne({
        where: {
          santri_uuid: req.params.uuid,
        },
      });
      if (!data) {
        responseHelper.notFound(req, res);
      } else {
        await Penumpang.destroy({
          where: {
            santri_uuid: req.params.uuid,
          },
        });

        await Santri.update(
          {
            status_kepulangan: "non-rombongan",
          },
          {
            where: {
              uuid: req.params.uuid,
            },
          }
        );
        responseHelper.deleted(req, res);
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },

  updatePembayaran: async (req, res) => {
    try {
      const { error, value } = penumpangValidation.updatePembayaran.validate(
        req.body
      );

      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        await Penumpang.update(
          {
            jumlah_bayar: value.jumlah_bayar,
            status_bayar: value.status_bayar,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );

        responseHelper.createdOrUpdated(req, res);
      }
      // }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
};
