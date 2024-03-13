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
  compareTagihan,
  allCompare,
  allNoTagihan,
  listMahrom,
  addMahrom,
  deleteMahrom,
} = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");
const multer = require("multer");
const lockdata = require("../../middleware/lockdata");
// Konfigurasi Multer untuk menyimpan file yang diunggah
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { keluarPos } = require("../surat-jalan/controller");

router.get("/", getAll);
router.get("/persyaratan", getAllPersyaratan);
router.get("/all-compare", allCompare);
router.get("/no-tagihan", allNoTagihan);

router.get("/export-excel", exportExcel);
router.get("/export-persyaratan", exportPersyaratan);
router.get("/unduh-template", access.keuangan, unduhTemplate);
router.post("/import-pembayaran", access.keuangan, upload.single("excelFile"), importBayar);
router.post("/compare-tagihan", access.keuangan, upload.single("excelFile"), compareTagihan);
router.post("/import-persyaratan", upload.single("excelFile"), importPersyaratan);

router.post("/upload-berkas/:uuid", access.wilayah, uploadBerkas);

router.get("/qrcode/:niup", access.wilayah, getQR);
router.get("/surat-jalan/:niup", access.wilayah, suratJalan);
router.get("/mahrom/:uuid", listMahrom);
router.get("/:uuid", getByUuid);
router.get("/:path(*)", access.wilayah, getBerkas);

router.post("/qrcode/:niup", access.wilayah, generateQR);

router.put("/armada/delete", access.admin, deleteArmada);
router.put("/armada/:id", access.admin, updateArmada);

router.delete("/mahrom/:id", access.admin, deleteMahrom);
router.delete("/berkas/:id", access.admin, deleteBerkas);
router.delete("/:uuid", access.wilayah, lockdata.lockDropspot, deleteRombongan);

router.put("/dropspot/:id", access.wilayah, lockdata.lockDropspot, updateDropspot);

router.put("/pemberangkatan/:id", access.pendamping, keluarPos);

router.put("/pembayaran/:id", access.keuangan, updatePembayaran);

router.put("/persyaratan/:id", ubahPersyaratan);
router.put("/mahrom/:id", addMahrom);

module.exports = router;
