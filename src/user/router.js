const express = require("express");
const {
  getAll,
  getById,
  update,
  destroy,
  updatePassword,
  updateRole,
  createInternal,
  createExternal,
  getByNiup,
} = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");

router.get("/", getAll);

router.get("/:uuid", getById);

router.get("/pilih/:niup", getByNiup);
router.post("/internal", createInternal);
router.post("/external", createExternal);

router.put("/password/:uuid", updatePassword);
router.put("/roles", updateRole);

router.put("/:uuid", update);

router.delete("/:uuid", destroy);

module.exports = router;
