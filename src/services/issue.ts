import moment from 'moment'
import * as dotenv from 'dotenv'
import fetch from 'cross-fetch'
import { Issue, Repository } from 'types/issue'

dotenv.config()

if (!process.env.ISSUES_GITHUB_TOKEN) {
  throw new Error('Github API Token not set.')
}

const cache = new Map()
const defaultSince = moment().subtract(1, 'year')
const orgs = [
  'solana-labs',
  'helius-labs',
  'saber-hq',
  'anza-xyz',

  // Wallets
  'coral-xyz',
  'solflare-wallet',
  'jup-ag',

  // DEXs
  'raydium-io',
  'drift-labs',

  // AI
  'sendaifun',

  //Defi
  'streamflow-finance',
  'pyth-network',
]
const orgString = `org:${orgs.join(' org:')}`

// Github docs
// https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax#query-for-dates
// https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests#search-by-number-of-comments

export async function GetRepos(since: moment.Moment = defaultSince): Promise<Repository[]> {
  const cacheKey = `issues.GetRepos-since:${since.format('YYYY-MM-DD')}`
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  let repos: Repository[] = []
  let cursor: string | undefined = ''

  while (cursor !== undefined) {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.ISSUES_GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      // good-first-issues:>0
      // help-wanted-issues:>0
      // stars:>10 // 100 // 10000
      body: JSON.stringify({
        query: `{
          search(
            first: 5, 
            ${cursor}
            query: "topic:Ethereum is:public archived:false good-first-issues:>0 stars:>10 pushed:>${since.format('YYYY-MM-DD')} sort:created",
            type: REPOSITORY
          ) {
            repositoryCount
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            nodes {
              ... on Repository {
                id
                name
                nameWithOwner
                description
                stargazerCount
                forkCount
                primaryLanguage {
                  name
                  color
                }
                url
                createdAt
                updatedAt
                pushedAt
                owner {
                  id
                  login
                  avatarUrl
                  url
                }
              }
            }
          }
        }`,
      }),
    })

    const body: any = await response.json()
    repos.push(
      ...body.data.search.nodes
        .filter((i: any) => !!i.id)
        .map((i: any) => {
          return {
            ...i,
            createdAt: new Date(i.createdAt).getTime(),
            updatedAt: new Date(i.updatedAt).getTime(),
            pushedAt: new Date(i.pushedAt).getTime(),
          }
        })
    )

    if (body.data.search.pageInfo.hasNextPage) {
      cursor = `after: "${body.data.search.pageInfo.endCursor}"`
    } else {
      cursor = undefined
    }
  }

  cache.set(cacheKey, repos)
  return repos
}

interface IssueFilter {
  goodFirstIssue?: boolean
}

export async function GetIssues(since: moment.Moment = defaultSince, filters: IssueFilter = {}): Promise<Issue[]> {
  // Create a unique cache key based on filters
  const filterStr = JSON.stringify(filters)
  const cacheKey = `issues.GetIssues-since:${since.toISOString()}-filters:${filterStr}`
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  let issues: Issue[] = []
  let cursor: string | undefined = ''
  // Build the label filter string
  let labelFilter = ''
  if (filters.goodFirstIssue) {
    labelFilter = 'label:\\"good first issue\\"'
  }
  // No else clause - leave labelFilter empty if no filters are applied

  const queryString = `${orgString} is:open is:issue ${labelFilter} created:>${since.toISOString()} sort:created`

  while (cursor !== undefined) {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.ISSUES_GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          search(
            first: 100, 
            ${cursor}
            query: "${queryString}",
            type: ISSUE
          ) {
            issueCount
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            nodes {
              ... on Issue {
                id
                number
                title
                body
                url
                createdAt
                updatedAt
                author {
                  ... on User {
                    id
                    login
                    avatarUrl
                    url
                  }
                }
                comments {
                  totalCount
                }
                labels(first: 20) {
                  totalCount
                  nodes {
                    name
                    color
                  }
                }
                repository {
                  ... on Repository {
                    id
                    name
                    nameWithOwner
                    description
                    stargazerCount
                    forkCount
                    primaryLanguage {
                      name
                      color
                    }
                    url
                    createdAt
                    updatedAt
                    pushedAt
                    owner {
                      id
                      login
                      avatarUrl
                      url
                    }
                  }
                }
              }
            }
          }
        }`,
      }),
    })

    const body: any = await response.json()
    issues.push(
      ...body.data.search.nodes
        .filter((i: any) => !!i.id)
        .map((i: any) => {
          return {
            ...i,
            commentsCount: i.comments.totalCount,
            labels: i.labels?.nodes
              ? i.labels.nodes.map((l: any) => {
                  return { name: l.name, color: l.color }
                })
              : [],
            author: i.author
              ? i.author
              : {
                  id: 'ghost',
                  login: 'Deleted user',
                  avatarUrl: 'https://avatars.githubusercontent.com/u/10137?v=4',
                  url: 'https://github.com/ghost',
                },
            repository: {
              ...i.repository,
            },
            createdAt: new Date(i.createdAt).getTime(),
            updatedAt: new Date(i.updatedAt).getTime(),
          }
        })
    )

    if (body.data.search.pageInfo.hasNextPage) {
      cursor = `after: "${body.data.search.pageInfo.endCursor}"`
    } else {
      cursor = undefined
    }
  }

  cache.set(cacheKey, issues)
  return issues
}
