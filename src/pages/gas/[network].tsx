import React from 'react'
import { ParsedUrlQuery } from 'querystring'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Category } from 'types/category'
import { NavigationProvider } from 'context/navigation'
import { DEFAULT_REVALIDATE_PERIOD } from 'utils/constants'
import styles from '../pages.module.scss'
import { SEO } from 'components/SEO'
import { MarkdownContentService } from 'services/content'
import { Heatmap } from 'components/charts/heatmap'
import { GasData as GasDataType, GasFee } from 'types/gas'
import Link from 'next/link'
import { GasTable } from 'components/gas-table'
import { TopnavLayout } from 'components/layouts/topnav'
import { Panel } from 'components/panel'
import { useSolPrice } from 'hooks/useSolPrice'
import { useTransactionFee } from 'hooks/useTransactionFee'
import { GasNotifications } from 'components/gas-notifications'
import { GetAverage, GetGasData } from 'services/indexer'
import { Featured } from 'components/featured'
import { TrendChart } from 'components/charts/trend'
import { capitalize } from 'utils/helpers'

interface Props {
  categories: Array<Category>
  network: string
  heatmap: GasFee[]
  gasData: GasDataType
}

interface Params extends ParsedUrlQuery {
  network: string
}

export default function Index(props: Props) {
  const { feeRate, priorityFee } = useTransactionFee(props.network)
  const solPrice = useSolPrice()
  const networkName = capitalize(props.network)
  const defaultTitle = `${networkName} Fee Tracker`
  const title = feeRate > 0 ? `${feeRate} Lamports` : defaultTitle

  return (
    <NavigationProvider categories={props.categories}>
      <SEO title={title} divider="⛽" description={`Monitor and track the ${networkName} transaction fees to reduce costs and save money.`} />
      <TopnavLayout className={styles.container} title={defaultTitle} action={{ href: 'https://www.solanatracker.com/docs', text: 'Get API Access' }}>
        <section>
          <Featured className={styles.featured} double>
            <Panel type="primary" fill stretch>
              <div style={{ padding: '8px' }}>
                <h4>⛽ Current</h4>
                <br />
                <span>{feeRate > 0 ? feeRate : '-'} Base fee</span>
                <br />
                <span>{priorityFee > 0 ? priorityFee : '-'} priority</span>
              </div>
            </Panel>
            <Panel type="neutral" stretch>
              <div style={{ padding: '8px' }}>
                <h4>🕘 Avg/last hour</h4>
                <br />
                <span>baseFee: {props.gasData.lastHour}</span>
              </div>
            </Panel>
          </Featured>
        </section>

        <article>
          <p>
            Transaction fees are a fundamental element for any public blockchain network such as {networkName}. Understanding how they work is key to
            efficiently use and develop on {networkName} and can greatly reduce the costs required to deploy and transact with the network.
          </p>
        </article>

        <section>
          <h2>Median Fee Rates</h2>
          <TrendChart data={props.gasData.fees} network={props.network as any} />
        </section>

        <section>
          <h2>Weekly Heatmap</h2>
          <Heatmap data={props.heatmap} network={props.network as any} />
        </section>

        <GasNotifications />

        <article className="markdown">
          <h2>Average {networkName} Transaction Costs</h2>
          <GasTable gasPrice={feeRate} solPrice={solPrice} />
        </article>

        <article className={`${styles.gas} markdown`}>
          <h3>Other Networks</h3>
          <ul>
            <li>
              <Link href="/gas">Solana Fee Tracker</Link>
            </li>
            <li>
              <Link href="/gas/devnet">Solana Devnet Fee Tracker</Link>
            </li>
            <li>
              <Link href="/gas/testnet">Solana Testnet Fee Tracker</Link>
            </li>
          </ul>
        </article>

        <article className="markdown">
          <h3>{networkName} Fees Explained</h3>
          <p>
            Transaction fees are an important concept within the Web3 world. They are the costs required to execute transactions on the network.
            Similar to how a car needs gasoline to drive. Most public blockchains denominate these transaction fees in their native currency.
          </p>
          <p>There are a few crucial aspects of transaction fees in public, permissionless networks:</p>
          <ol>
            <li>
              Every transaction published on a blockchain imposes a cost of downloading, executing and verifying it. People who run a node
              (validators) spend time, money and effort to do this for which they are compensated. Transaction fees are rewarded to them for providing
              these services.
            </li>
            <li>
              A fee market allows prioritization of transactions by adding a priority fee for validators to process specific transactions more
              quickly.
            </li>
            <li>For smart contract platforms, it avoids computational waste in code, by setting limits to resource usage when executing programs.</li>
            <li>
              Additionally, it prevents accidental or hostile infinite loops, e.g. denial of service (&apos;DDoS&apos;) attacks. In a DDoS attack, an
              attacker tries to flood the network by spamming empty transactions. A fee market ensures that doing such attacks, for an extended period
              of time, becomes expensive.
            </li>
          </ol>
        </article>

        <article className={`${styles.gas} markdown`}>
          <h3>Further reading</h3>
          <ul>
            <li>
              <Link href="https://docs.solana.com/transaction_fees">https://docs.solana.com/transaction_fees</Link>
            </li>
            <li>
              <Link href="https://www.solanatracker.com/">https://www.solanatracker.com/</Link>
            </li>
          </ul>
        </article>
      </TopnavLayout>
    </NavigationProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: { network: 'devnet' },
      },
      {
        params: { network: 'testnet' },
      },
      {
        params: { network: 'mainnet-beta' },
      },
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const network = context.params?.network ?? ''
  const service = new MarkdownContentService()
  const categories = await service.GetCategories()

  if (!network || !['devnet', 'testnet', 'mainnet', 'mainnet-beta'].includes(network)) {
    return {
      props: null,
      notFound: true,
      revalidate: DEFAULT_REVALIDATE_PERIOD,
    }
  }

  const gasData = await GetGasData(network as any)
  const hourlyAverages = await GetAverage('hour', 168, network as any)

  return {
    props: {
      categories,
      network,
      gasData,
      heatmap: hourlyAverages ?? [],
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD,
  }
}
