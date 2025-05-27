const express = require("express");
const router = express.Router();
const methodController = require("../controllers/method");

router.get(
  "/:id/hygienic_standards",
  methodController.getMethodHygienicStandards,
);

router.get('/:id/using_area', methodController.getUsingArea);

router.get('/:id/substance_area', methodController.getSubstanceArea);

router.get('/:id/error_area', methodController.getErrorArea);

router.get('/:id/error_limits', methodController.getErrorLimits);

router.get('/:id/support_equipping', methodController.getSupportEquipping);

router.get('/:id/chemical_glassware', methodController.getChemicalGlassware);

router.get('/:id/chemical_agents', methodController.getChemicalAgents);

router.get('/:id/support_extantion', methodController.getSupportExtantion);

router.get('/:id/principle', methodController.getMethodPrinciple);

router.get('/:id/strange_substances', methodController.getStrangeSubstances);

router.get('/:id/safety_requirements', methodController.getSafetyRequirements);

router.get('/:id/measurement_conditions', methodController.getMeasurementConditions);

router.get('/:id/room_conditions', methodController.getRoomConditions);

router.get("/", methodController.getMethods);

router.get("/:id", methodController.getMethod);

module.exports = router;
