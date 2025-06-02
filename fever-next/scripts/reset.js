const { execSync } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

try {
  // remove database via uninstall script
  execSync('node ./scripts/uninstall.js', { stdio: 'inherit' });
  // run migrations
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Database reset complete');
} catch (err) {
  console.error('Reset failed', err);
  process.exit(1);
}
