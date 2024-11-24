const Firebird = require("node-firebird");
const genericPool = require("generic-pool");

const options = require("./dbOptions");

const poolOptions = {
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000,
  acquireTimeoutMillis: 10000,
};
const pool = genericPool.createPool(
  {
    create() {
      return new Promise((resolve, reject) => {
        Firebird.attach(options, (err, db) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(db);
        });
      });
    },
    destroy(db) {
      return new Promise((resolve) => {
        db.detach();
        resolve();
      });
    },
  },
  poolOptions,
);

module.exports = {
  async query(sql, params = []) {
    const db = await pool.acquire();
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, result) => {
        pool.release(db);
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  },
  async close() {
    await pool.drain();
    await pool.clear();
  },
};
