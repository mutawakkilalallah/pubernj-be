const responseHelper = require("../helpers/response-helper");

module.exports = {
  sysadmin: async (req, res, next) => {
    if (req.role === "sysadmin") {
      next();
    } else {
      responseHelper.forbidden(req, res);
    }
  },
  admin: async (req, res, next) => {
    if (req.role === "sysadmin" || req.role === "admin") {
      next();
    } else {
      responseHelper.forbidden(req, res);
    }
  },
  wilayah: async (req, res, next) => {
    if (
      req.role === "sysadmin" ||
      req.role === "admin" ||
      req.role === "wilayah" ||
      req.role === "daerah"
    ) {
      next();
    } else {
      responseHelper.forbidden(req, res);
    }
  },
  internal: async (req, res, next) => {
    if (req.role != "p4nj" || req.role === "pendamping") {
      next();
    } else {
      responseHelper.forbidden(req, res);
    }
  },
  keuangan: async (req, res, next) => {
    if (req.role === "sysadmin" || req.role === "keuangan") {
      next();
    } else {
      responseHelper.forbidden(req, res);
    }
  },
  armada: async (req, res, next) => {
    if (req.role === "sysadmin" || req.role === "armada") {
      next();
    } else {
      responseHelper.forbidden(req, res);
    }
  },
};
