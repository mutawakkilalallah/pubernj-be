const express = require("express");
const {
  getAll,
  getByUuid,
  getImage,
  filterWilayah,
  filterBlok,
  dafatarRombongan,
  getByCard,
} = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");
const lockdata = require("../../middleware/lockdata");

router.get("/", access.internal, getAll);

router.get("/image/:niup", getImage);

router.get("/card/:card", access.internal, getByCard);
router.get("/:uuid", access.internal, getByUuid);
router.post(
  "/daftar/:uuid",
  access.wilayah,
  lockdata.lockDropspot,
  dafatarRombongan
);

router.get("/filter/wilayah", access.internal, filterWilayah);
router.get("/filter/blok", access.internal, filterBlok);

module.exports = router;
