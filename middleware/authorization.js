const responseHelper = require("../helpers/response-helper");

module.exports = {
  sysadmin: async (req, res, next) => {
    if (req.role === "sysadmin") {
      req.role = req.role;
      next();
    } else {
      responseHelper.forbidden(res);
    }
  },
  admin: async (req, res, next) => {
    if (req.role === "sysadmin" || req.role === "admin") {
      req.role = req.role;
      req.blok_id = req.blok_id ? req.blok_id : null;
      next();
    } else {
      responseHelper.forbidden(res);
    }
  },
  wilayah: async (req, res, next) => {
    if (
      req.role === "sysadmin" ||
      req.role === "admin" ||
      req.role === "wilayah"
    ) {
      req.role = req.role;
      req.blok_id = req.blok_id ? req.blok_id : null;
      next();
    } else {
      responseHelper.forbidden(res);
    }
  },
};
