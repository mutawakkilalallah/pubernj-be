const express = require("express");
const { getAll, getById, create, update, destroy } = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");
const auth = require("../../middleware/authentication");

router.get("/", getAll);

router.get("/:id", auth, getById);

router.post("/", auth, access.sysadmin, create);

router.put("/:id", auth, access.sysadmin, update);

router.delete("/:id", auth, access.sysadmin, destroy);

module.exports = router;
