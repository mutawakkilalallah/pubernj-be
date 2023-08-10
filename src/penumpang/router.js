const express = require("express");
const {
  getAll,
  getByUuid,
  updateArmada,
  deleteArmada,
  updateDropspot,
  updatePembayaran,
  deleteRombongan,
} = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");

router.get("/", getAll);

router.get("/:uuid", getByUuid);

router.put("/armada/delete", access.admin, deleteArmada);
router.put("/armada/:id", access.admin, updateArmada);

router.delete("/:uuid", access.wilayah, deleteRombongan);

router.put("/dropspot/:id", access.wilayah, updateDropspot);

router.put("/pembayaran/:id", access.keuangan, updatePembayaran);

module.exports = router;
