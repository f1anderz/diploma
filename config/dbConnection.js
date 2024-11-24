const Firebird = require("node-firebird");

const options = require("./dbOptions");

let dbInstance = null;

function getDatabaseInstance(callback) {
  if (dbInstance) {
    callback(null, dbInstance);
    return;
  }
  Firebird.attach(options, (err, db) => {
    if (err) {
      callback(err);
      return;
    }
    dbInstance = db;
    callback(null, dbInstance);
  });
}

module.exports = {
  query(sql, params = [], callback) {
    getDatabaseInstance((err, db) => {
      if (err) {
        callback(err);
        return;
      }
      db.query(sql, params, callback);
    });
  },

  close() {
    if (dbInstance) {
      dbInstance.detach();
      dbInstance = null;
    }
  },
};
