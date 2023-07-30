const Joi = require("joi");

module.exports = {
  createAndUpdate: Joi.object({
    nama: Joi.string().required().messages({
      "string.base": "nama harus berisi huruf",
      "string.empty": "nama tidak boleh kosong",
      "any.required": "nama harus harus diisi",
    }),
    pic: Joi.string().required().messages({
      "string.base": "pic harus berisi huruf",
      "string.empty": "pic tidak boleh kosong",
      "any.required": "pic harus harus diisi",
    }),
    no_hp: Joi.number().integer().required().messages({
      "number.base": "no hp harus berisi angka",
      "any.required": "no hp harus diisi",
    }),
  }),
};
