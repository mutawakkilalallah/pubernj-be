const moment = require("moment-timezone");
const { UserActivity } = require("../models");
const { ErrorReport } = require("../models");

module.exports = {
  loggerSucces: async (req, status) => {
    let data = {
      nama_lengkap: req.nama_lengkap,
      username: `@${req.username}`,
      time: moment().format(),
      method: req.method,
      path: req.originalUrl,
      code: status,
      user_info: {
        clientIp: req.ip,
        userAgent: req.get("User-Agent"),
        referer: req.get("Referer"),
      },
    };
    data.user_info = JSON.stringify(data.user_info);
    await UserActivity.create(data);
  },
  loggerAuth: async (req, userData) => {
    let data = {
      nama_lengkap: userData.nama_lengkap,
      username: `@${userData.username}`,
      time: moment().format(),
      method: req.method,
      path: req.originalUrl,
      code: 200,
      user_info: {
        clientIp: req.ip,
        userAgent: req.get("User-Agent"),
        referer: req.get("Referer"),
      },
    };
    data.user_info = JSON.stringify(data.user_info);
    await UserActivity.create(data);
  },
  loggerAdUp: async (req) => {
    let data = {
      nama_lengkap: req.nama_lengkap,
      username: `@${req.username}`,
      time: moment().format(),
      method: req.method,
      path: req.originalUrl,
      payload: req.body,
      code: 201,
      user_info: {
        clientIp: req.ip,
        userAgent: req.get("User-Agent"),
        referer: req.get("Referer"),
      },
    };
    data.payload = JSON.stringify(data.payload);
    data.user_info = JSON.stringify(data.user_info);
    await UserActivity.create(data);
  },

  loggerError: async (req, status, message, error) => {
    let data = {
      nama_lengkap: req.nama_lengkap ? req.nama_lengkap : "anonymus",
      username: `@${
        req.username
          ? req.username
          : req.body.username
          ? req.body.username
          : "anonymus"
      }`,
      time: moment().format(),
      method: req.method,
      path: req.originalUrl,
      code: status,
      message: {
        code: status,
        message: message,
        error: error,
      },
      user_info: {
        clientIp: req.ip,
        userAgent: req.get("User-Agent"),
        referer: req.get("Referer"),
      },
    };
    data.message = JSON.stringify(data.message);
    data.user_info = JSON.stringify(data.user_info);
    await ErrorReport.create(data);
  },
};
