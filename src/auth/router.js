const express = require("express");
const { login, loginPedatren, generateIzin } = require("./controller");
const router = express.Router();
const auth = require("../../middleware/authentication");
const access = require("../../middleware/authorization");

router.post("/login", login);

router.get("/auth/pedatren", loginPedatren);

router.get("/generate-izin", auth, access.wilayah, generateIzin);

module.exports = router;
