const express = require("express");
const { getAll } = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");

router.get("/", access.sysadmin, getAll);

module.exports = router;
