const express = require("express");
const { getAll, getByUuid, getImage } = require("./controller");
const router = express.Router();

router.get("/", getAll);

router.get("/image/:uuid", getImage);

router.get("/:uuid", getByUuid);

module.exports = router;
