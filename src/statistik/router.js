const express = require("express");
const { getAll, keuangan } = require("./controller");
const router = express.Router();
// const access = require("../../middleware/authorization");

router.get("/estimasi-armada", getAll);
router.get("/keuangan", keuangan);

module.exports = router;
