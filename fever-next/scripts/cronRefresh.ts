import { fetchFeeds } from './fetchFeeds'
import cron from 'node-cron'

cron.schedule('*/10 * * * *', async () => {
  await fetchFeeds()
})

fetchFeeds()
