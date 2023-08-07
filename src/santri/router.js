const express = require("express");
const {
  getAll,
  getByUuid,
  getImage,
  filterWilayah,
  filterBlok,
} = require("./controller");
const router = express.Router();

router.get("/", getAll);

router.get("/image/:niup", getImage);

router.get("/:uuid", getByUuid);

router.get("/filter/wilayah", filterWilayah);
router.get("/filter/blok", filterBlok);

module.exports = router;
