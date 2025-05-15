import * as dotenv from 'dotenv'
import moment from 'moment'
import { GetIssues } from '../services/issue'
import { truncate } from '../utils/helpers'
import { SendTweets } from 'utils/twitter'

dotenv.config()

console.log('Get latest issues')
run()

async function run() {
  const since = moment.utc().subtract(7, 'day')
  const issues = await GetIssues(since)
  console.log('Issues since', since.toISOString(), issues.length)
  console.log('')

  if (issues.length === 0) {
    console.log('No new issues..')
    return
  }

  // Send 1st tweet
  let first = `Contribute to open-source Solana projects ✨\n\n`
  first += `Make your first contribution to any of these 'good first'-issues below 🌈\n\n`
  first += `${issues.length} new issues this week 🛠️`

  // Tweet per issue
  const items = issues.map((item, index) => {
    let body = `➡️ ${item.repository.nameWithOwner}\n\n`
    if (item.repository.primaryLanguage.name) {
      body += `Main language: #${item.repository.primaryLanguage.name}`
    }

    const remainingLength = 280 - (body.length + 25 + 15) // domain + extra/spacing/numbering
    return `${index + 1}. ${truncate(item.title, remainingLength)}\n\n${body}\n\n${item.url}`
  })

  // Sent last tweet
  let last = `These are just the latest from last week..\n\n`
  last += `Browse more than +500 #OpenSource 'Good first'-issues on core protocol, developer tooling, infra, SDKs, consensus and execution clients, L2's, etc. 🛠️\n\n`
  last += `https://www.useweb3.xyz/contribute`

  await SendTweets([first, ...items, last])
}
