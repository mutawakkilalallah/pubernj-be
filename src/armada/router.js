const express = require("express");
const {
  getAll,
  getById,
  create,
  update,
  destroy,
  updatePendamping,
  deletePendamping,
  updateSyncNama,
} = require("./controller");
const router = express.Router();
const access = require("../../middleware/authorization");

router.get("/", getAll);

router.get("/:id", getById);

router.post("/", access.armada, create);

router.put("/sync-nama", access.armada, updateSyncNama);
router.put("/:id", access.armada, update);
router.put("/pendamping/:id", access.admin, updatePendamping);
router.put("/pendamping/delete/:id", access.admin, deletePendamping);

router.delete("/:id", access.armada, destroy);

module.exports = router;
