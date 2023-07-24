const express = require("express");
const {
  setupPenumpang,
  generatePenumpang,
  updatePenumpang,
  updateUser,
  setupSantri,
  generateSantri,
  updateSantri,
} = require("./controller");
const router = express.Router();

router.get("/setup/penumpang", setupPenumpang);

router.post("/generate/penumpang/:page", generatePenumpang);

router.put("/update/penumpang", updatePenumpang);

router.put("/update/user", updateUser);

router.get("/setup/santri", setupSantri);

router.post("/generate/santri/:page", generateSantri);

router.put("/update/santri", updateSantri);

// router.get("/image/:uuid", getImage);

// router.get("/:uuid", getByUuid);

module.exports = router;
