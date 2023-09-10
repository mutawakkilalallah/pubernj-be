const express = require("express");
const {
  allIzin,
  allSurat,
  tautkanPedatren,
  loginPedatren,
  createIzin,
  //   cetakPdf,
} = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");

router.get("/login-pedatren/:uuid", loginPedatren);
router.get("/izin-pedatren", allIzin);
router.get("/cetak-surat", allSurat);

// router.get("/cetak-pdf", cetakPdf);

router.post("/create-izin", createIzin);

router.put("/tautkan-pedatren/:uuid", tautkanPedatren);

module.exports = router;
