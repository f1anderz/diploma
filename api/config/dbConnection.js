const Firebird = require("node-firebird");

let dbInstance = null;

function getDatabaseInstance(callback) {
  if (dbInstance) {
    callback(null, dbInstance);
    return;
  }
  Firebird.attach({
    host: 'localhost',
    port: 3050,
    database: '/opt/firebird/CMPI_DB.FDB',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }, (err, db) => {
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
