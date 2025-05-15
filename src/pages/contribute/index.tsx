import React from 'react'
import { ParsedUrlQuery } from 'querystring'
import { ContentItem } from 'types/content-item'
import { GetServerSideProps } from 'next'
import { Category } from 'types/category'
import { NavigationProvider } from 'context/navigation'
import { DEFAULT_MAX_ITEMS, DEFAULT_REVALIDATE_PERIOD } from 'utils/constants'
import styles from '../pages.module.scss'
import { MarkdownContentService } from 'services/content'
import { TopnavLayout } from 'components/layouts/topnav'
import { GetIssues, GetRepos } from 'services/issue'
import { SEO } from 'components/SEO'
import { Issue } from 'types/issue'
import { PagedResult } from 'types/paged'
import { IssuesOverview } from 'components/issues'

interface Props {
  categories: Array<Category>
  items: Array<ContentItem>
  results: PagedResult<Issue>
}

interface Params extends ParsedUrlQuery {
  category: string
  goodFirstIssue?: string
}

export default function Index(props: Props) {
  return (
    <NavigationProvider categories={props.categories}>
      <SEO
        title="Contribute"
        divider="✨"
        description="Make your first contribution to any open-source Solana project by tackling on of these 'Good first' issues."
      />
      <TopnavLayout className={styles.container} title="Contribute to open-source Solana projects">
        <IssuesOverview
          results={props.results}
          onFilterChange={(filters) => {
            // This is handled via URL updates in the IssuesOverview component
          }}
        />
      </TopnavLayout>
    </NavigationProvider>
  )
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { query } = context
  const goodFirstIssue = query.goodFirstIssue === 'true'

  const service = new MarkdownContentService()
  const items = await service.GetItems('', true)
  const categories = await service.GetCategories()
  const issues = await GetIssues(undefined, { goodFirstIssue })

  const repos = await GetRepos()

  return {
    props: {
      items,
      categories,
      results: {
        total: issues.length,
        currentPage: 1,
        items: issues.slice(0, DEFAULT_MAX_ITEMS),
      },
    },
  }
}
