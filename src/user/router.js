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

router.get("/", getAll);

router.get("/:id", getById);

router.post("/", create);

router.put("/password/:id", updatePassword);

router.put("/:id", update);

router.delete("/:id", destroy);

module.exports = router;
