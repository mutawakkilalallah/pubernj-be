const express = require("express");
const { userActivity, errorReport } = require("./controller");
const router = express.Router();

router.get("/user-activity", userActivity);
router.get("/error-report", errorReport);

module.exports = router;
