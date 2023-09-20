const express = require("express");
const { getByNiup, getImageSurat } = require("./controller");
const router = express.Router();

router.get("/:niup", getByNiup);
router.get("/surat-image/:image", getImageSurat);

module.exports = router;
