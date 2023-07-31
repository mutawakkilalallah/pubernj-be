const express = require("express");
const { getAll } = require("./controller");
// const { getAll, getById, create, update, destroy } = require("./controller");
const router = express.Router();
// const access = require("../../middleware/authorization");

router.get("/", getAll);

// router.get("/:id", getById);

// router.post("/", access.sysadmin, create);

// router.put("/:id", access.sysadmin, update);

// router.delete("/:id", access.sysadmin, destroy);

module.exports = router;
