require("dotenv").config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const responseHelper = require("../helpers/response-helper");

module.exports = async (req, res, next) => {
  const jwtToken = req.headers["x-auth-token"];
  jwt.verify(jwtToken, JWT_SECRET_KEY, function (err, decoded) {
    if (err) {
      responseHelper.unauthorized(res);
    } else {
      req.role = decoded.role;
      req.blok_id = decoded.blok_id;
      next();
    }
  });
};
