const Joi = require("joi");

module.exports = {
  createAndUpdate: Joi.object({
    nama: Joi.string().required().messages({
      "string.base": "nama harus berisi huruf",
      "string.empty": "nama tidak boleh kosong",
      "any.required": "nama harus diisi",
    }),
    grup: Joi.required().messages({
      "any.required": "type harus diisi",
    }),
    area_id: Joi.required().messages({
      "any.required": "area harus diisi",
    }),
    cakupan: Joi.string().required().messages({
      "string.base": "cakupan harus berisi huruf",
      "string.empty": "cakupan tidak boleh kosong",
      "any.required": "cakupan harus diisi",
    }),
    harga: Joi.number().integer().required().messages({
      "number.base": "harga harus berisi angka",
      "any.required": "harga harus diisi",
    }),
  }),
};
