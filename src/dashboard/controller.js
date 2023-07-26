require("dotenv").config();
const { Santri, Penumpang, Area, Dropspot, User } = require("../../models");
const responseHelper = require("../../helpers/response-helper");

module.exports = {
  index: async (req, res) => {
    try {
      whereCondition = {};

      if (req.role === "wilayah") {
        whereCondition = {
          blok_id: req.blok_id,
        };
      }

      const totalSantri = await Santri.count({
        where: whereCondition,
      });
      const totalPenumpang = await Penumpang.count({
        where: whereCondition,
      });
      const totalTidakRombongan = totalSantri - totalPenumpang;
      const totalArea = await Area.count();
      const totalDropspot = await Dropspot.count();
      const totalUser = await User.count();

      res.status(200).json({
        code: 200,
        message: "Berhasil mendapatkan semua data",
        data: {
          totalSantri,
          totalPenumpang,
          totalTidakRombongan,
          totalArea,
          totalDropspot,
          totalUser,
        },
      });
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },
};
