require("dotenv").config();
const { User } = require("../../models");
const authValidation = require("../../validations/auth-validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const axios = require("axios");
// const { JWT_SECRET_KEY, API_PEDATREN_URL, API_PEDATREN_TOKEN } = process.env;
const { JWT_SECRET_KEY } = process.env;
const responseHelper = require("../../helpers/response-helper");

module.exports = {
  login: async (req, res) => {
    try {
      const { error, value } = authValidation.login.validate(req.body);
      if (error) {
        responseHelper.badRequest(res, error.message);
      } else {
        username = value.username;
        password = value.password;

        const data = await User.findOne({
          where: {
            username: username,
          },
        });
        if (!data) {
          responseHelper.forbidden(res);
        } else {
          const validPassword = await bcrypt.compare(password, data.password);
          if (!validPassword) {
            responseHelper.forbidden(res);
          } else {
            const token = await jwt.sign(
              {
                id: data.id,
                username: data.username,
                // active: data.active,
                role: data.role,
                // blok_id: data.blok_id,
              },
              JWT_SECRET_KEY,
              {
                expiresIn: "30m",
              }
            );

            // const response = await axios.get(
            //   API_PEDATREN_URL + "/person/" + data.santri_uuid,
            //   {
            //     headers: {
            //       "x-api-key": API_PEDATREN_TOKEN,
            //     },
            //   }
            // );

            // responseHelper.auth(res, token, data, response.data);
            responseHelper.auth(res, token, data);
          }
        }
      }
    } catch (err) {
      responseHelper.serverError(res, err.message);
    }
  },
};
