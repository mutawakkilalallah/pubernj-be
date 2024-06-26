const Joi = require("joi");

module.exports = {
  updateArmada: Joi.object({
    id_penumpang: Joi.required().messages({
      "any.required": "armada harus diisi",
    }),
  }),
  updateDropspot: Joi.object({
    dropspot_id: Joi.required().messages({
      "any.required": "dropspot harus diisi",
    }),
  }),
  updatePembayaran: Joi.object({
    jumlah_bayar: Joi.required().messages({
      "any.required": "jumlah pembayaran harus diisi",
    }),
  }),
  updateKeberangkatan: Joi.object({
    status_keberangkatan: Joi.required().messages({
      "any.required": "status keberangkatan harus diisi",
    }),
  }),
  ubahPersyaratan: Joi.object({
    type: Joi.required().messages({
      "any.required": "type persyaratan harus diisi",
    }),
  }),
  addMahrom: Joi.object({
    mahrom_id: Joi.required().messages({
      "any.required": "id mahrom harus diisi",
    }),
  }),
};
