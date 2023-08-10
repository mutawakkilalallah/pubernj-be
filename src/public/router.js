const express = require("express");
const { getByNiup } = require("./controller");
const router = express.Router();

router.get("/:niup", getByNiup);

module.exports = router;
