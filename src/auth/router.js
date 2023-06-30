const express = require("express");
const { login } = require("./controller");
const router = express.Router();

router.post("/login", login);

module.exports = router;
