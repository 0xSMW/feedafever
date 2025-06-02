const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const match = dbUrl.match(/^file:(.*)$/);
if (!match) {
  console.error('Uninstall script only supports SQLite file URLs');
  process.exit(1);
}
const dbPath = path.resolve(__dirname, '..', match[1]);
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Database removed:', dbPath);
} else {
  console.log('Database file not found:', dbPath);
}
