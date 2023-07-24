require("dotenv").config();
const { Santri, Penumpang, Area, Dropspot, User } = require("../../models");
const responseHelper = require("../../helpers/response-helper");

module.exports = {
  index: async (req, res) => {
    try {
      const totalSantri = await Santri.count();
      const totalPenumpang = await Penumpang.count();
      const totalArea = await Dropspot.count();
      const totalDropspot = await User.count();
      const totalUser = await Area.count();

      res.status(200).json({
        code: 200,
        message: "Berhasil mendapatkan semua data",
        data: {
          totalSantri,
          totalPenumpang,
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
