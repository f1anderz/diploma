const fdb = require("../../config/dbConnection");

exports.getMethods = async (req, res) => {
  await fdb.query("SELECT * FROM v_methods", (err, result) => {
    if (err) {
      res.status(500).send("Query failed");
    } else {
      res.json(result);
    }
  });
};

exports.getMethodHygienicStandards = async (req, res) => {
  await fdb.query(
    `SELECT * FROM v_hygienic_standards WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getUsingArea = async (req,res) => {
  await fdb.query(
    `SELECT * FROM v_using_area WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getSubstanceArea = async (req,res) => {
  await fdb.query(
    `SELECT * FROM v_substance_area WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getErrorArea = async (req,res) => {
  await fdb.query(
    `SELECT * FROM v_error_area WHERE MTHD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getErrorLimits = async (req,res) => {
  await fdb.query(
    `SELECT * FROM v_error_limits WHERE MTHD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getSupportEquipping = async (req,res) => {
  await fdb.query(
    `SELECT ID, CAST(NAMING AS VARCHAR(500) CHARACTER SET WIN1251) AS NAMING, CAST(ACCORDING_TO AS VARCHAR(500) CHARACTER SET WIN1251) AS ACCORDING_TO FROM v_support_equipping WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getChemicalGlassware = async (req,res) => {
  await fdb.query(
    `SELECT ID, CAST(NAMING AS VARCHAR(500) CHARACTER SET WIN1251) AS NAMING, CAST(ACCORDING_TO AS VARCHAR(500) CHARACTER SET WIN1251) AS ACCORDING_TO FROM v_chemical_glassware WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getChemicalAgents = async (req,res) => {
  await fdb.query(
    `SELECT ID, CAST(NAMING AS VARCHAR(500) CHARACTER SET WIN1251) AS NAMING, CAST(ACCORDING_TO AS VARCHAR(500) CHARACTER SET WIN1251) AS ACCORDING_TO FROM  v_chemical_agents WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getSupportExtantion = async (req,res) => {
  await fdb.query(
    `SELECT ID, CAST(ERMISSION AS VARCHAR(500) CHARACTER SET WIN1251) AS ERMISSION, CAST(REQUIREMENT AS VARCHAR(500) CHARACTER SET WIN1251) AS REQUIREMENT FROM v_support_extantion WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getMethodPrinciple = async (req,res) => {
  await fdb.query(
    `SELECT ID, CAST(PRINCIPLE AS VARCHAR(1500) CHARACTER SET WIN1251) AS PRINCIPLE, CAST(UNIT AS VARCHAR(1500) CHARACTER SET WIN1251) AS UNIT, CAST(SELECTIVITY AS VARCHAR(500) CHARACTER SET WIN1251) AS SELECTIVITY, DURATION FROM v_method_principle WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getStrangeSubstances = async (req,res) => {
  await fdb.query(
    `SELECT ID, CAST(SUBSTANCE AS VARCHAR(500) CHARACTER SET WIN1251) AS SUBSTANCE, CAST(SOURCE AS VARCHAR(500) CHARACTER SET WIN1251) AS SOURCE FROM v_strange_substances WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getSafetyRequirements = async (req,res) => {
  await fdb.query(
    `SELECT ID, CAST(REQUIREMENT AS VARCHAR(500) CHARACTER SET WIN1251) AS REQUIREMENT FROM v_safety_requirements WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getMeasurementConditions = async (req,res) => {
  await fdb.query(
    `SELECT ID, CAST(PREPARATION AS VARCHAR(500) CHARACTER SET WIN1251) AS PREPARATION, CAST(MEASUREMENT AS VARCHAR(500) CHARACTER SET WIN1251) AS MEASUREMENT FROM v_measurement_conditions WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getRoomConditions = async (req,res) => {
  await fdb.query(
    `SELECT ID, CAST(CNDT_INDEX AS VARCHAR(500) CHARACTER SET WIN1251) AS CNDT_INDEX, CAST(CNDT_VALUE AS VARCHAR(500) CHARACTER SET WIN1251) AS CNDT_VALUE FROM v_room_conditions WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};
