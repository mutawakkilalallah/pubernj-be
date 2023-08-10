const Joi = require("joi");

module.exports = {
  updateDropspot: Joi.object({
    dropspot_id: Joi.required().messages({
      "any.required": "dropspot harus diisi",
    }),
  }),
};
