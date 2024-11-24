const express = require("express");
const router = express.Router();
const methodController = require("../controllers/method");

router.get(
  "/:id/hygienic_standards",
  methodController.getMethodHygienicStandards,
);

router.get("/", methodController.getMethods);

router.get("/:id", methodController.getMethod);

module.exports = router;
