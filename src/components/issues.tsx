import { Pagination } from 'components/pagination'
import { Featured } from 'components/featured'
import styles from './issues.module.scss'
import { IssuePanel, PanelCard } from './panel'
import { PagedResult } from 'types/paged'
import { DEFAULT_MAX_ITEMS } from 'utils/constants'
import { Issue } from 'types/issue'
import { GasNotifications } from './gas-notifications'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { UrlObject } from 'url'

interface Props {
  results: PagedResult<Issue>
  className?: string
  onFilterChange?: (filters: { goodFirstIssue: boolean }) => void
}

export function IssuesOverview(props: Props) {
  let className = `${styles.container}`
  if (props.className) className += ` ${props.className}`

  const router = useRouter()
  const [showGoodFirstIssue, setShowGoodFirstIssue] = useState(false)

  // Read URL parameters on component mount
  useEffect(() => {
    const { query } = router
    const goodFirstIssue = query.goodFirstIssue === 'true'
    setShowGoodFirstIssue(goodFirstIssue)
  }, [router.query])

  // Notify parent component when filters change
  useEffect(() => {
    if (props.onFilterChange) {
      props.onFilterChange({
        goodFirstIssue: showGoodFirstIssue,
      })
    }
  }, [showGoodFirstIssue, props.onFilterChange])

  // Update URL when checkbox state changes and trigger a full page reload for server-side filtering
  const updateUrlAndFilter = (goodFirstIssue: boolean) => {
    const query: { [key: string]: string } = {}
    if (goodFirstIssue) {
      query.goodFirstIssue = 'true'
    }
    // Use router.push without the shallow option to trigger a full server reload
    router.push({
      pathname: router.pathname,
      query,
    })
  }

  const handleGoodFirstIssueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked
    setShowGoodFirstIssue(newValue)
    updateUrlAndFilter(newValue)
  }

  // Generate pagination URL that preserves filters
  const getPaginationUrl = (page: number): { pathname: string; query: any } => {
    const query = { ...router.query }
    if (page === 1) {
      return { pathname: '/contribute', query }
    }
    return { pathname: `/contribute/${page}`, query }
  }

  if (!props.results || props.results.items?.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <p>Make your first contribution to any open-source Solana project by tackling one of the issues listed below.</p>
      <p>Each issue displayed here is a &apos;good first&apos;-issue, selected for its approachability for first-time contributors.</p>

      <Featured className={styles.featured}>
        <PanelCard
          title="Solana Docs"
          icon="✨"
          description="The official documentation for Solana, a high-performance blockchain."
          url="https://docs.solana.com/"
          level="Beginner"
          tags={['Blockchain', 'Rust', 'Web3']}
        />
        <PanelCard
          title="Solana Ecosystem Hub"
          icon="✨"
          description="Explore projects, grants, and ways to contribute to the Solana ecosystem."
          url="https://solana.org"
          level="Intermediate"
          tags={['Community', 'Open Source', 'Projects']}
        />
        <PanelCard
          title="Anchor Framework"
          icon="✨"
          description="Anchor is a framework for Solana's Sealevel runtime providing several convenient developer tools for writing smart contracts."
          url="https://www.anchor-lang.com/"
          level="Intermediate"
          tags={['Rust', 'Smart Contracts', 'Solana']}
        />
      </Featured>

      {/* TODO: Add back in */}
      {/* <article>
        <GasNotifications type="oss" description='Sign up to receive the latest "Good First" issues in your mailbox.' />
      </article> */}

      <div className={styles.controlsHeader}>
        <div className={styles.filters}>
          <label>
            <input type="checkbox" checked={showGoodFirstIssue} onChange={handleGoodFirstIssueChange} />
            Good first issue
          </label>
        </div>
        <Pagination
          className={styles.pagination}
          itemsPerPage={DEFAULT_MAX_ITEMS}
          totalItems={props.results.total}
          currentPage={props.results.currentPage}
          truncate
          getLinkProps={(page) => getPaginationUrl(page)}
        />
      </div>

      <main>
        <Featured type="rows">
          {props.results.items.map((i) => {
            return <IssuePanel key={`${i.id}_${i.number}`} issue={i} />
          })}
        </Featured>
      </main>
      <Pagination
        className={styles.pagination}
        itemsPerPage={DEFAULT_MAX_ITEMS}
        totalItems={props.results.total}
        currentPage={props.results.currentPage}
        truncate
        getLinkProps={(page) => getPaginationUrl(page)}
      />
    </div>
  )
}
