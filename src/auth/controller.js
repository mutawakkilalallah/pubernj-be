require("dotenv").config();
const { User, Santri } = require("../../models");
const authValidation = require("../../validations/auth-validation");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const bcrypt = require("bcrypt");
const responseHelper = require("../../helpers/response-helper");
const logger = require("../../helpers/logger");

module.exports = {
  login: async (req, res) => {
    try {
      const { error, value } = authValidation.login.validate(req.body);
      if (error) {
        responseHelper.badRequest(req, res, error.message);
      } else {
        username = value.username;
        password = value.password;

        const data = await User.findOne({
          where: {
            username: username,
          },
        });
        if (!data) {
          responseHelper.forbidden(req, res);
        } else {
          const validPassword = await bcrypt.compare(password, data.password);
          if (!validPassword) {
            responseHelper.forbidden(req, res);
          } else {
            const token = await jwt.sign(
              {
                uuid: data.uuid,
                nama_lengkap: data.nama_lengkap,
                username: data.username,
                role: data.role,
                wilayah: data.alias_wilayah ? data.alias_wilayah : null,
                id_blok: data.id_blok ? data.id_blok : null,
                area: data.area_id ? data.area_id : null,
              },
              JWT_SECRET_KEY,
              {
                expiresIn: "1h",
              }
            );
            data.password = null;
            logger.loggerAuth(req, data);
            responseHelper.auth(req, res, token, data);
          }
        }
      }
    } catch (err) {
      responseHelper.serverError(req, res, err.message);
    }
  },
};
