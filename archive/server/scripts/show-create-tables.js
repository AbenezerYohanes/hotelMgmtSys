const db = require('../config/db');

async function main() {
  await db.connect();
  const sequelize = db.sequelize;
  const tables = process.argv.slice(2);
  if (tables.length === 0) {
    console.log('Usage: node show-create-tables.js <table1> <table2> ...');
    process.exit(1);
  }
  for (const t of tables) {
    try {
      const res = await sequelize.query(`SHOW CREATE TABLE \`${t}\``, { type: db.Sequelize.QueryTypes.SELECT });
      console.log('\n=== SHOW CREATE TABLE', t, '===');
      if (res && res.length > 0) {
        const key = Object.keys(res[0]).find(k => /Create Table/i.test(k) || /Create Table/i.test(k));
        console.log(res[0][key] || JSON.stringify(res[0]));
      } else {
        console.log('No result for', t);
      }
    } catch (err) {
      console.error('Error for table', t, ':', err.message || err);
    }
  }
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
