const Joi = require("joi");

module.exports = {
  createAndUpdate: Joi.object({
    nama: Joi.string().required().messages({
      "string.base": "nama harus berisi huruf",
      "string.empty": "nama tidak boleh kosong",
      "any.required": "nama harus diisi",
    }),
    type: Joi.required().messages({
      "any.required": "type harus diisi",
    }),
    jenis: Joi.required().messages({
      "any.required": "jenis harus diisi",
    }),
    harga: Joi.number().integer().required().messages({
      "number.base": "harga harus berisi angka",
      "any.required": "harga harus diisi",
    }),
    dropspot_id: Joi.required().messages({
      "any.required": "dropspot harus diisi",
    }),
  }),
  updatePendamping: Joi.object({
    pendamping: Joi.required(),
    nomer_hp: Joi.required(),
  }),
};
