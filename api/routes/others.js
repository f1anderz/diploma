const express = require("express");
const router = express.Router();
const othersController = require('../controllers/others');

router.get('/required_reglament', othersController.getRequirementReglament);

router.get('/operator_skills', othersController.getOperatorSkills);