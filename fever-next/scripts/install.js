const { execSync } = require('child_process');

try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Database ready');
} catch (err) {
  console.error('Install failed', err);
  process.exit(1);
}
