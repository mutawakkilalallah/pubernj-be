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
    dropspot_id: Joi.required().messages({
      "any.required": "dropspot harus diisi",
    }),
  }),
};
