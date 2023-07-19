const express = require("express");
const { getAll, getById, create, update, destroy } = require("./controller");
const router = express.Router();

router.get("/", getAll);

router.get("/:id", getById);

router.post("/", create);

router.put("/:id", update);

router.delete("/:id", destroy);

module.exports = router;
