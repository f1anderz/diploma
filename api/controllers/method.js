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
