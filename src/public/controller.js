const {
  Penumpang,
  Area,
  Dropspot,
  Santri,
  Armada,
  Persyaratan,
  User,
} = require("../../models");
const responseHelper = require("../../helpers/response-helper");
const fs = require("fs");
const path = require("path");

module.exports = {
  getByNiup: async (req, res) => {
    try {
      const data = await Penumpang.findOne({
        where: {
          "$santri.niup$": req.params.niup,
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
          {
            model: Persyaratan,
            as: "persyaratan",
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

  getImageSurat: async (req, res) => {
    const fileName = `berkas/${req.params.image}`;
    try {
      const fileExtension = path.extname(fileName);
      const filePath = path.resolve(__dirname, "../..", fileName);
      const fileBuffer = fs.readFileSync(filePath);

      res.writeHead(200, {
        "Content-Type": `image/${fileExtension.substr(1)}`,
      });
      res.end(fileBuffer);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
};
