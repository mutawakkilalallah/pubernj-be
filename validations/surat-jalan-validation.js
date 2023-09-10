const Joi = require("joi");

module.exports = {
  kaitkanPedatren: Joi.object({
    username: Joi.string().required().messages({
      "string.base": "username harus berisi huruf",
      "string.empty": "username tidak boleh kosong",
      "any.required": "username harus diisi",
    }),
    password: Joi.required().messages({
      "any.required": "password harus diisi",
    }),
  }),
};
