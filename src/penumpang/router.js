const express = require("express");
const { getAll, getById, updateArmada, deleteArmada } = require("./controller");
// const { getAll, getById, create, update, destroy } = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");

router.get("/", getAll);

router.get("/:id", getById);

// router.post("/", access.sysadmin, create);

router.put("/armada/delete", deleteArmada);
router.put("/armada/:id", updateArmada);

// router.put("/:id", access.sysadmin, update);

// router.delete("/:id", access.sysadmin, destroy);

module.exports = router;
