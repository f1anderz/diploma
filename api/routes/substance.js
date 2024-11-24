const express = require("express");
const router = express.Router();
const substanceController = require("../controllers/substance");

router.get("/:id/preparates", substanceController.getSubstancePreparates);

router.get("/:id/synonyms", substanceController.getSubstanceSynonyms);

router.get("/:id/solubility", substanceController.getSubstanceSolubility);

router.get(
  "/:id/vapor_pressure",
  substanceController.getSubstanceVaporPressure,
);

router.get("/", substanceController.getSubstances);

router.get("/:id", substanceController.getSubstance);

module.exports = router;
