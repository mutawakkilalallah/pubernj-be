require("dotenv").config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const responseHelper = require("../helpers/response-helper");

module.exports = async (req, res, next) => {
  const jwtToken = req.headers["x-auth-token"];
  jwt.verify(jwtToken, JWT_SECRET_KEY, function (err, decoded) {
    if (err) {
      responseHelper.unauthorized(req, res);
    } else {
      req.uuid = decoded.uuid;
      req.nama_lengkap = decoded.nama_lengkap;
      req.username = decoded.username;
      req.role = decoded.role;
      req.wilayah = decoded.wilayah;
      req.id_blok = decoded.id_blok;
      req.area = decoded.area;
      next();
    }
  });
};
