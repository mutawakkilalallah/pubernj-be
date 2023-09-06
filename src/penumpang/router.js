const express = require("express");
const {
  getAll,
  getByUuid,
  updateArmada,
  deleteArmada,
  updateDropspot,
  updatePembayaran,
  deleteRombongan,
  unduhTemplate,
  importBayar,
  updateKeberangkatan,
  generateQR,
  getQR,
  suratJalan,
  getAllPersyaratan,
  ubahPersyaratan,
  exportExcel,
  uploadBerkas,
  getBerkas,
  deleteBerkas,
  exportPersyaratan,
  importPersyaratan,
} = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");
const multer = require("multer");
// Konfigurasi Multer untuk menyimpan file yang diunggah
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", getAll);
router.get("/persyaratan", getAllPersyaratan);

router.get("/export-excel", exportExcel);
router.get("/export-persyaratan", exportPersyaratan);
router.get("/unduh-template", access.keuangan, unduhTemplate);
router.post(
  "/import-pembayaran",
  access.keuangan,
  upload.single("excelFile"),
  importBayar
);
router.post(
  "/import-persyaratan",
  access.bps,
  upload.single("excelFile"),
  importPersyaratan
);

router.post("/upload-berkas/:uuid", access.wilayah, uploadBerkas);

router.get("/qrcode/:niup", access.wilayah, getQR);
router.get("/surat-jalan/:niup", access.wilayah, suratJalan);
router.get("/:uuid", getByUuid);
router.get("/:path(*)", access.wilayah, getBerkas);

router.post("/qrcode/:niup", access.wilayah, generateQR);

router.put("/armada/delete", access.admin, deleteArmada);
router.put("/armada/:id", access.admin, updateArmada);

router.delete("/berkas/:id", access.admin, deleteBerkas);
router.delete("/:uuid", access.wilayah, deleteRombongan);

router.put("/dropspot/:id", access.wilayah, updateDropspot);

router.put("/pemberangkatan/:id", access.pendamping, updateKeberangkatan);

router.put("/pembayaran/:id", access.keuangan, updatePembayaran);

router.put("/persyaratan/:id", access.wilayah, ubahPersyaratan);

module.exports = router;
