import { fetchFeeds } from './fetchFeeds';

async function run() {
  await fetchFeeds();
}

run();
setInterval(run, 1000 * 60 * 10);
