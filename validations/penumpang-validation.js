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
    status_bayar: Joi.required().messages({
      "any.required": "status harus diisi",
    }),
  }),
};
