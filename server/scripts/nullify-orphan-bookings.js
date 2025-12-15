const db = require('../config/db');

async function main() {
  await db.connect();
  const sequelize = db.sequelize;
  const r = await sequelize.query('SELECT COUNT(*) AS cnt FROM bookings WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users)', { type: db.Sequelize.QueryTypes.SELECT });
  const cnt = r && r[0] && (r[0].cnt || r[0].COUNT) ? (r[0].cnt || r[0].COUNT) : 0;
  console.log('Orphan count before:', cnt);
  if (cnt > 0) {
    await sequelize.query('UPDATE bookings SET user_id = NULL WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users)');
    console.log('Orphans set to NULL');
  }
  try {
    await sequelize.query("ALTER TABLE `bookings` ADD CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE");
    console.log('ALTER succeeded');
  } catch (e) {
    console.error('ALTER retry failed:', e.message || e);
  }
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
