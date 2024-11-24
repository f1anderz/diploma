const fdb = require("../../config/dbConnection");

exports.getSubstances = async (req, res) => {
  await fdb.query(`SELECT * FROM v_substance_descr`, (err, result) => {
    if (err) {
      return res.status(500).send({ msg: "Internal error", error: err });
    }
    res.json(result);
  });
};

exports.getSubstance = async (req, res) => {
  await fdb.query(
    `SELECT * FROM v_substance_descr WHERE id = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getSubstancePreparates = async (req, res) => {
  await fdb.query(
    `SELECT * FROM v_substance_preparates WHERE SUBSTANCE_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getSubstanceSynonyms = async (req, res) => {
  await fdb.query(
    `SELECT * FROM v_substance_synonyms WHERE SUBST_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getSubstanceSolubility = async (req, res) => {
  await fdb.query(
    `SELECT * FROM v_solubility WHERE SUBSTANCE_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getSubstanceVaporPressure = async (req, res) => {
  await fdb.query(
    `SELECT * FROM v_vapor_pressure WHERE SUBSTANCE_ID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};
