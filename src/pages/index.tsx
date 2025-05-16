import React from 'react'
import { ParsedUrlQuery } from 'querystring'
import { Featured } from 'components/featured'
import { ContentItem } from 'types/content-item'
import { GetStaticProps } from 'next'
import { Category } from 'types/category'
import { NavigationProvider } from 'context/navigation'
import { DEFAULT_REVALIDATE_PERIOD } from 'utils/constants'
import styles from './pages.module.scss'
import { MarkdownContentService } from 'services/content'
import { TopnavLayout } from 'components/layouts/topnav'
import { PanelCard } from 'components/panel'
import { TitleWithAction } from 'components/layouts/title-action'
import { Tags } from 'components/tags'
import { toTags } from 'utils/helpers'

interface Props {
  categories: Array<Category>
  items: Array<ContentItem>
}

interface Params extends ParsedUrlQuery {
  category: string
}

export default function Index(props: Props) {
  return (
    <NavigationProvider categories={props.categories}>
      <TopnavLayout className={styles.container} hideNewsletter={true}>
        <article>
          <p>
            useSolana is a platform for developers to explore and learn about Solana. Whether you&apos;re a new dev getting your hands dirty for the
            first time, or a seasoned developer making the transition into the Solana ecosystem.
          </p>
          <p>
            <strong>Explore. Learn. Build on Solana.</strong>
          </p>
        </article>

        <article>
          <h2>Start learning</h2>
          <p>
            Explore the latest resources and get familiar with the core concepts and fundamentals of Solana. Learn from tutorials, courses, books,
            videos or code challenges and start building on the fastest blockchain!
          </p>
        </article>

        {props.categories.map((category) => {
          const items = props.items.filter((item) => item.category.id === category.id)
          if (items.length === 0) return null

          // return <Slider title={category.title} items={items} />

          return (
            <Featured key={category.id} className={styles.featured} title={category.title} link={category.id}>
              {items.map((i) => {
                return (
                  <PanelCard
                    key={i.id}
                    title={i.title}
                    icon={i.category.emoji}
                    description={i.description}
                    url={i.url}
                    detailsUrl={`/${i.category.id}/${i.id}`}
                    level={i.level}
                    tags={i.tags}
                  />
                )
              })}
            </Featured>
          )
        })}
      </TopnavLayout>
    </NavigationProvider>
  )
}

export const getStaticProps: GetStaticProps<Props, Params> = async () => {
  const service = new MarkdownContentService()
  const items = await service.GetItems('', true)
  const categories = await service.GetCategories()

  return {
    props: {
      items,
      categories,
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD,
  }
}
