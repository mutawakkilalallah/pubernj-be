const Joi = require("joi");

module.exports = {
  // login validation
  login: Joi.object({
    username: Joi.string().required().messages({
      "string.base": "username harus berisi huruf",
      "string.empty": "username tidak boleh kosong",
      "any.required": "username harus harus diisi",
    }),
    password: Joi.string().required().messages({
      "string.base": "password harus berisi huruf",
      "string.empty": "password tidak boleh kosong",
      "any.required": "password harus harus diisi",
    }),
  }),
};
