import React from 'react'
import { GetStaticProps } from 'next'
import { Category } from 'types/category'
import { NavigationProvider } from 'context/navigation'
import { DEFAULT_REVALIDATE_PERIOD } from 'utils/constants'
import { SEO } from 'components/SEO'
import { MarkdownContentService } from 'services/content'
import { TopnavLayout } from 'components/layouts/topnav'
import styles from '../pages.module.scss'
import { Panel } from 'components/panel'
import { useTransactionFee } from 'hooks/useTransactionFee'
import { GasNotifications } from 'components/gas-notifications'

interface Props {
  categories: Array<Category>
}

export default function Index(props: Props) {
  const { feeRate, priorityFee } = useTransactionFee()
  const title = 'Solana Fee Tracker API'
  const description = 'Get access to Solana transaction fee data through our Fee Tracker API.'

  return (
    <NavigationProvider categories={props.categories}>
      <SEO title={title} divider="⛽" description={description} />
      <TopnavLayout className={styles.container} title={title} hideNewsletter>
        <section>
          <p>
            <Panel fill>
              ⛽ {feeRate > 0 ? feeRate : '-'} Base fee | {priorityFee > 0 ? priorityFee : '-'} priority
            </Panel>
          </p>
        </section>

        <article>
          <p>{description}</p>
        </article>

        <article>
          <GasNotifications type="api" description="Register for API Access" />
        </article>
      </TopnavLayout>
    </NavigationProvider>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const service = new MarkdownContentService()
  const categories = await service.GetCategories()

  return {
    props: {
      categories,
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD,
  }
}
