const express = require("express");
const {
  getAll,
  getById,
  create,
  update,
  destroy,
  updatePassword,
} = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");

router.get("/", access.admin, getAll);

router.get("/:id", access.admin, getById);

router.post("/", access.admin, create);

router.put("/password/:id", updatePassword);

router.put("/:id", update);

router.delete("/:id", access.sysadmin, destroy);

module.exports = router;
