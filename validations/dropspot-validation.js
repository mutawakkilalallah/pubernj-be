const Joi = require("joi");

module.exports = {
  // create validation
  createAndUpdate: Joi.object({
    nama: Joi.string().required().messages({
      "string.base": "nama harus berisi huruf",
      "string.empty": "nama harus tidak boleh kosong",
      "any.required": "nama harus harus diisi",
    }),
    type: Joi.required().messages({
      "any.required": "type harus harus diisi",
    }),
    area_id: Joi.required().messages({
      "any.required": "areaId harus harus diisi",
    }),
    cakupan: Joi.string().required().messages({
      "string.base": "cakupan harus berisi huruf",
      "string.empty": "cakupan harus tidak boleh kosong",
      "any.required": "cakupan harus harus diisi",
    }),
    // harga: Joi.number().integer().required().messages({
    //   "number.base": "harga harus berisi angka",
    //   "any.required": "harga harus harus diisi",
    // }),
  }),
};
