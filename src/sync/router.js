const express = require("express");
const {
  generateSantri,
  updateSantri,
  generatePenumpangv1,
  generatePenumpangv2,
  generatePenumpangv3,
  generatePenumpangv4,
  generatePenumpangv5,
  generatePenumpangv6,
  generatePenumpangv7,
  generatePenumpangv8,
  generatePenumpangv9,
  generatePenumpangv10,
  generatePenumpangv11,
  generatePenumpangv12,
  excludePenumpang,
  // updatePenumpang,
  updateUser,
} = require("./controller");
const router = express.Router();

router.post("/generate/penumpang/v1", generatePenumpangv1);
router.post("/generate/penumpang/v2", generatePenumpangv2);
router.post("/generate/penumpang/v3", generatePenumpangv3);
router.post("/generate/penumpang/v4", generatePenumpangv4);
router.post("/generate/penumpang/v5", generatePenumpangv5);
router.post("/generate/penumpang/v6", generatePenumpangv6);
router.post("/generate/penumpang/v7", generatePenumpangv7);
router.post("/generate/penumpang/v8", generatePenumpangv8);
router.post("/generate/penumpang/v9", generatePenumpangv9);
router.post("/generate/penumpang/v10", generatePenumpangv10);
router.post("/generate/penumpang/v11", generatePenumpangv11);
router.post("/generate/penumpang/v12", generatePenumpangv12);
router.delete("/exclude/penumpang", excludePenumpang);
// router.put("/update/penumpang", updatePenumpang);

router.put("/update/user", updateUser);

router.post("/generate/santri", generateSantri);
router.put("/update/santri", updateSantri);

module.exports = router;
