const express = require("express");
const {
  allIzin,
  allSurat,
  tautkanPedatren,
  loginPedatren,
  createIzin,
  viewLog,
  getQrIzin,
  allKonfir,
  confirmIzin,
  hapusPedatren,
  updateStatusCetak,
  //   cetakPdf,
} = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");

router.get("/login-pedatren/:uuid", loginPedatren);
router.get("/izin-pedatren", allIzin);
router.get("/cetak-surat", allSurat);
router.get("/konfirmasi-izin", allKonfir);
router.get("/view-log", viewLog);
router.get("/qr-izin/:niup", getQrIzin);

// router.get("/cetak-pdf", cetakPdf);

router.post("/create-izin", createIzin);

router.put("/tautkan-pedatren/:uuid", tautkanPedatren);
router.put("/hapus-pedatren/:uuid", hapusPedatren);
router.put("/konfirmasi-izin", confirmIzin);
router.put("/status-cetak", updateStatusCetak);

module.exports = router;
