const fdb = require('../../config/dbConnection');

exports.getRequirementReglament = async (req,res) => {
  await fdb.query(
    `SELECT * FROM v_requirement_reglament`,
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
    `SELECT * FROM v_operator_skills`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Internal error", error: err });
      }
      res.json(result);
    },
  );
};