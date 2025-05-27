const fdb = require('../../config/dbConnection');

exports.getRequirementReglament = async (req,res) => {
  await fdb.query(
    `SELECT ID, CAST(NORM_DOC AS VARCHAR(500) CHARACTER SET WIN1251) AS NORM_DOC, CAST(DOC_REG AS VARCHAR(500) CHARACTER SET WIN1251) AS DOC_REG FROM v_requirement_reglament`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};

exports.getOperatorSkills = async (req,res) => {
  await fdb.query(
    `SELECT ID, CAST(MEASUREMENT AS VARCHAR(500) CHARACTER SET WIN1251) AS MEASUREMENT, CAST(PREPARATION AS VARCHAR(500) CHARACTER SET WIN1251) AS PREPARATION FROM v_operator_skills`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};