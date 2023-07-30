const Joi = require("joi");

module.exports = {
  updateArmada: Joi.object({
    id_penumpang: Joi.required().messages({
      "any.required": "role harus harus diisi",
    }),
  }),
};
