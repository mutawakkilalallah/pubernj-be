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
} = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");
const multer = require("multer");
// Konfigurasi Multer untuk menyimpan file yang diunggah
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", getAll);

router.get("/unduh-template", access.keuangan, unduhTemplate);
router.post(
  "/import-pembayaran",
  access.keuangan,
  upload.single("excelFile"),
  importBayar
);

router.get("/:uuid", getByUuid);

router.put("/armada/delete", access.admin, deleteArmada);
router.put("/armada/:id", access.admin, updateArmada);

router.delete("/:uuid", access.wilayah, deleteRombongan);

router.put("/dropspot/:id", access.wilayah, updateDropspot);

router.put("/pemberangkatan/:id", access.pendamping, updateKeberangkatan);

router.put("/pembayaran/:id", access.keuangan, updatePembayaran);

module.exports = router;
