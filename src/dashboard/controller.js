require("dotenv").config();
const { Area, Dropspot, User } = require("../../models");
const responseHelper = require("../../helpers/response-helper");

module.exports = {
  index: async (req, res) => {
    try {
      const totalUser = await Area.count();
      const totalArea = await Dropspot.count();
      const totalDropspot = await User.count();

      res.status(200).json({
        code: 200,
        message: "Berhasil mendapatkan semua data",
        data: {
          totalUser,
          totalArea,
          totalDropspot,
        },
      });
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },
};
