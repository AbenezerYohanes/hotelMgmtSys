const db = require('../config/db');

async function main() {
  await db.connect();
  const sequelize = db.sequelize;
  const res = await sequelize.query('SHOW ENGINE INNODB STATUS', { type: db.Sequelize.QueryTypes.SELECT });
  if (res && res.length > 0) {
    const v = Object.values(res[0]).find(x => typeof x === 'string');
    console.log(v);
  } else {
    console.log('No InnoDB status output.');
  }
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
