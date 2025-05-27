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

exports.getMethod = async (req, res) => {
  await fdb.query(
    `SELECT * FROM v_methods WHERE id = ${req.params.id}`,
    (err, result) => {
      if (err) {
        res.status(500).send("Query failed");
      } else {
        res.json(result);
      }
    },
  );
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
    `SELECT * FROM v_support_equipping WHERE METHOD_ID = ${req.params.id}`,
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
    `SELECT * FROM v_chemical_glassware WHERE METHOD_ID = ${req.params.id}`,
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
    `SELECT * FROM v_chemical_agents WHERE METHOD_ID = ${req.params.id}`,
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
    `SELECT ID, CAST(ERMISSION AS VARCHAR(100) CHARACTER SET WIN1251), CAST(REQUIREMENT AS VARCHAR(100) CHARACTER SET WIN1251) FROM v_support_extantion WHERE METHOD_ID = ${req.params.id}`,
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
    `SELECT * FROM v_method_principle WHERE METHOD_ID = ${req.params.id}`,
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
    `SELECT * FROM v_strange_substances WHERE METHOD_ID = ${req.params.id}`,
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
    `SELECT * FROM v_safety_requirements WHERE METHOD_ID = ${req.params.id}`,
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
    `SELECT * FROM v_measurement_conditions WHERE METHOD_ID = ${req.params.id}`,
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
    `SELECT * FROM v_room_conditions WHERE METHOD_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};
