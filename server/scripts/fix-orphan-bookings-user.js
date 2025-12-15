const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function run() {
  try {
    await db.connect();
  } catch (err) {
    console.error('DB connect failed:', err.message || err);
    process.exit(1);
  }
  const sequelize = db.sequelize;
  const orphan = await sequelize.query(`SELECT b.* FROM bookings b LEFT JOIN users u ON b.user_id = u.id WHERE b.user_id IS NOT NULL AND u.id IS NULL`, { type: db.Sequelize.QueryTypes.SELECT });
  const out = path.join(__dirname, '..', 'logs', `orphan-bookings-${new Date().toISOString().replace(/[:.]/g,'-')}.json`);
  fs.writeFileSync(out, JSON.stringify(orphan, null, 2));
  console.log('Orphan bookings written to', out);
  if (orphan.length === 0) { console.log('No orphan bookings found.'); process.exit(0); }

  // Backup rows by copying to a backup table
  const ts = new Date().toISOString().replace(/[:.]/g,'-');
  const backupName = `bookings_orphan_backup_${ts}`;
  try {
    await sequelize.query(`CREATE TABLE IF NOT EXISTS \`${backupName}\` LIKE bookings`);
    await sequelize.query(`INSERT INTO \`${backupName}\` SELECT * FROM bookings WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users)`);
    console.log('Created backup table', backupName);
  } catch (err) {
    console.error('Backup table creation failed:', err.message || err);
  }

  // Set user_id to NULL for orphaned bookings
  try {
    const res = await sequelize.query(`UPDATE bookings SET user_id = NULL WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users)`);
    console.log('Updated orphan bookings to set user_id = NULL');
  } catch (err) {
    console.error('Failed to update orphan bookings:', err.message || err);
    process.exit(1);
  }
  process.exit(0);
}

run().catch(e=>{ console.error(e); process.exit(1); });
