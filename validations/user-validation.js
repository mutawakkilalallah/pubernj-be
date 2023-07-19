const Joi = require("joi");

module.exports = {
  createAndUpdate: Joi.object({
    santri_uuid: Joi.required().messages({
      "any.required": "santri_uuid harus harus diisi",
    }),
    username: Joi.string().required().messages({
      "string.base": "username harus berisi huruf",
      "string.empty": "username harus tidak boleh kosong",
      "any.required": "username harus harus diisi",
    }),
    role: Joi.string().required().messages({
      "string.base": "role harus berisi huruf",
      "string.empty": "role harus tidak boleh kosong",
      "any.required": "role harus harus diisi",
    }),
    password: Joi.required().messages({
      "any.required": "password harus harus diisi",
    }),
  }),
};
