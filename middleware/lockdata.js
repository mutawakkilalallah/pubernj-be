const responseHelper = require("../helpers/response-helper");

module.exports = {
  lockDropspot: async (req, res, next) => {
    const waktuSekarang = new Date();
    const batasAkhir = new Date("2023-09-12T23:59:00");
    const isLewat = waktuSekarang > batasAkhir;
    const allowRules = ["sysadmin", "admin"];
    const notAdmin = !allowRules.includes(req.role);
    if (isLewat && notAdmin) {
      responseHelper.badRequest(
        req,
        res,
        "Tidak dapat mengubah dropspot, mendaftarkan atau menghapus rombongan, karena sudah melewati batas waktu yang ditentukan"
      );
    } else {
      next();
    }
  },
};
