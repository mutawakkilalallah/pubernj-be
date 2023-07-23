const Joi = require("joi");

module.exports = {
  // create validation
  createAndUpdate: Joi.object({
    nama: Joi.string().required().messages({
      "string.base": "nama harus berisi huruf",
      "string.empty": "nama harus tidak boleh kosong",
      "any.required": "nama harus harus diisi",
    }),
    // pic: Joi.string().required().messages({
    //   "string.base": "pic harus berisi huruf",
    //   "string.empty": "pic harus tidak boleh kosong",
    //   "any.required": "pic harus harus diisi",
    // }),
    // no_hp: Joi.number().integer().required().messages({
    //   "number.base": "hp harus berisi angka",
    //   "any.required": "hp harus harus diisi",
    // }),
  }),
};
