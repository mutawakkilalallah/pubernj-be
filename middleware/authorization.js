const responseHelper = require("../helpers/response-helper");

module.exports = {
  sysadmin: async (req, res, next) => {
    if (req.role != "sysadmin") {
      responseHelper.forbidden(res);
    } else {
      req.role = req.role;
      req.blok_id = req.blok_id ? req.blok_id : null;
      next();
    }
  },
};
