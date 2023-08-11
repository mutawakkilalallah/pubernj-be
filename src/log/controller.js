const { UserActivity, ErrorReport } = require("../../models");
const responseHelper = require("../../helpers/response-helper");
const moment = require("moment-timezone");
require("moment/locale/id");

module.exports = {
  userActivity: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 500;
      const offset = 0 + (page - 1) * limit;

      const data = await UserActivity.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [["created_at", "DESC"]],
      });
      data.rows.map((d) => {
        d.user_info = JSON.parse(d.user_info);
        if (d.payload != null) {
          d.payload = JSON.parse(d.payload);
        }
      });
      responseHelper.allData(req, res, page, limit, data);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
  errorReport: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 500;
      const offset = 0 + (page - 1) * limit;

      const data = await ErrorReport.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [["created_at", "DESC"]],
      });
      data.rows.map((d) => {
        d.user_info = JSON.parse(d.user_info);
        if (d.message != null) {
          d.message = JSON.parse(d.message);
        }
      });
      responseHelper.allData(req, res, page, limit, data);
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
};
