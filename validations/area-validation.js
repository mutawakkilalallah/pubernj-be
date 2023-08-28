const Joi = require("joi");

module.exports = {
  createAndUpdate: Joi.object({
    nama: Joi.string().required().messages({
      "string.base": "nama harus berisi huruf",
      "string.empty": "nama tidak boleh kosong",
      "any.required": "nama harus diisi",
    }),
    pic: Joi.string().required().messages({
      "string.base": "pic harus berisi huruf",
      "string.empty": "pic tidak boleh kosong",
      "any.required": "pic harus diisi",
    }),
    no_hp: Joi.number().integer().required().messages({
      "number.base": "nomer hp harus berisi angka",
      "any.required": "nomer hp harus diisi",
    }),
    pic_ext: Joi.string().optional().messages({
      "string.base": "pic external harus berisi huruf",
      "string.empty": "pic external tidak boleh kosong",
    }),
    no_hp_ext: Joi.number().integer().optional().messages({
      "number.base": "nomer hp pic external harus berisi angka",
    }),
  }),
};
