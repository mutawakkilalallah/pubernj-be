const express = require("express");
const {
  getAll,
  getById,
  update,
  destroy,
  updatePassword,
  createInternal,
  createExternal,
  getByNiup,
} = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");

router.get("/", access.admin, getAll);

router.get("/:uuid", getById);

router.get("/pilih/:niup", getByNiup);
router.post("/internal", access.admin, createInternal);
router.post("/external", access.sysadmin, createExternal);

router.put("/password/:uuid", updatePassword);

router.put("/:uuid", access.admin, update);

router.delete("/:uuid", access.admin, destroy);

module.exports = router;
