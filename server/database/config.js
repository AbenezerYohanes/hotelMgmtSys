const db = require('../config/db');
const { QueryTypes } = require('sequelize');

// Simple query wrapper that returns an object similar to previous helpers
async function query(sql, params = []) {
  const sequelize = db.sequelize;
  const results = await sequelize.query(sql, {
    replacements: params,
    type: QueryTypes.SELECT,
    raw: true
  });
  return { rows: results };
}

module.exports = {
  pool: null,
  query,
  transaction: async (fn) => {
    const t = await db.sequelize.transaction();
    try {
      const result = await fn(t);
      await t.commit();
      return result;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
  healthCheck: async () => {
    try {
      await db.sequelize.authenticate();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }
};