const Joi = require("joi");

module.exports = {
  createInternal: Joi.object({
    niup: Joi.required().messages({
      "any.required": "niup harus diisi",
    }),
    username: Joi.string().required().messages({
      "string.base": "username harus berisi huruf",
      "string.empty": "username tidak boleh kosong",
      "any.required": "username harus diisi",
    }),
    role: Joi.required().messages({
      "any.required": "role harus diisi",
    }),
    password: Joi.required().messages({
      "any.required": "password harus diisi",
    }),
    area_id: Joi.optional(),
    nama_lengkap: Joi.optional(),
  }),
  createExternal: Joi.object({
    nama_lengkap: Joi.string().required().messages({
      "string.base": "nama harus berisi huruf",
      "string.empty": "nama tidak boleh kosong",
      "any.required": "nama harus diisi",
    }),
    username: Joi.string().required().messages({
      "string.base": "username harus berisi huruf",
      "string.empty": "username tidak boleh kosong",
      "any.required": "username harus diisi",
    }),
    role: Joi.required().messages({
      "any.required": "role harus diisi",
    }),
    password: Joi.required().messages({
      "any.required": "password harus diisi",
    }),
    area_id: Joi.optional(),
    niup: Joi.optional(),
  }),
  update: Joi.object({
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
    area_id: Joi.optional(),
  }),
  updatePassword: Joi.object({
    password: Joi.required().messages({
      "any.required": "password harus harus diisi",
    }),
  }),
  updateRole: Joi.object({
    id_user: Joi.required().messages({
      "any.required": "role harus harus diisi",
    }),
    role: Joi.string().required().messages({
      "string.base": "role harus berisi huruf",
      "string.empty": "role harus tidak boleh kosong",
      "any.required": "role harus harus diisi",
    }),
  }),
};
