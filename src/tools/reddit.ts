import * as dotenv from 'dotenv'
import snoowrap from 'snoowrap'

console.log('Reddit API Access')
dotenv.config()
run()

// TODO: Add a new reddit tool for useSolana
async function run() {
  const type = process.argv[2]
  if (type === 'post') {
    submitToReddit('Learn Solana Development @ useSolana', 'https://www.usesolana.xyz/')
    return
  }

  const flairs = [
    'Tutorial',
    'My Project',
    'Fundamentals',
    'Educational',
    'r/solanadev',
    'r/Solanax',
    'r/SolanaNFT',
    'r/SOLNFT',
    'r/Solana_Memes',
    'r/solwork',
  ]
  const subreddits = ['soldev', 'solana', 'solana-noobies', 'solana-dev']

  const client = initClient()

  // console.log('GET Flairs')
  // const flairs = await client.getSubreddit('ethdev').getLinkFlairTemplates()
  // flairs.forEach(i => console.log('-', i.flair_text, i.flair_template_id))

  const subsQuery = `(subreddit:${subreddits.join(' OR subreddit:')})`
  const flairsQuery = `(flair:${flairs.join(' OR flair:')})`

  const results = await client.search({
    query: `${subsQuery} AND ${flairsQuery}`,
    time: 'month',
    sort: 'top',
    limit: 25,
  })
  results.forEach((i) => {
    console.log(`- ${i.created_utc} ${i.subreddit_name_prefixed} (${i.link_flair_text})`)
    console.log(i.title)
    console.log(i.url)
    console.log()
  })
}

export function submitToReddit(title: string, url: string) {
  const client = initClient()

  client
    .getSubreddit('solana')
    .submitLink({
      subredditName: 'solana',
      title,
      url,
      // no flair
    })
    .then((i) => console.log('OK', i))

  // r/ethdev
  client
    .getSubreddit('solanadev')
    .submitLink({
      subredditName: 'solanadev',
      title,
      url,
      flairId: '95e9673a-f444-11e5-9bbc-0ee43ad8a7ed',
    })
    .then((i) => console.log('OK', i))

  // r/ethereumnoobies
  client
    .getSubreddit('ethereumnoobies')
    .submitLink({
      subredditName: 'ethereumnoobies',
      title,
      url,
      flairId: '916d9bb6-195c-11e7-bbf8-0e0bfb1a8e84',
    })
    .then((i) => console.log('OK', i))

  // r/eth
  client
    .getSubreddit('eth')
    .submitLink({
      subredditName: 'eth',
      title,
      url,
      flairId: '9d1b4a2e-cd45-11ec-a278-22915d55d8c1',
    })
    .then((i) => console.log('OK', i))
}

export function initClient(): snoowrap {
  return new snoowrap({
    userAgent: 'useSolana',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
  })
}
