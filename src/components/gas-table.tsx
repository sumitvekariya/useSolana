import { useState } from 'react'
import styles from './gas-table.module.scss'

interface Props {
  gasPrice: number
  solPrice: number
  className?: string
}

const transactions = [
  { name: 'SOL Transfer', cost: 5000 },
  { name: 'SPL Token Approval', cost: 10000 },
  { name: 'SPL Token Transfer', cost: 15000 },
  { name: 'NFT Transfer', cost: 25000 },
  { name: 'Raydium Swap', cost: 35000 },
  { name: 'Jupiter Swap', cost: 45000 },
  { name: 'Magic Eden Sale', cost: 65000 },
  { name: 'Liquidity Provision', cost: 75000 },
  { name: 'Wormhole Bridge Transfer', cost: 100000 },
  { name: 'SNS Name Registration', cost: 120000 },
]

export function GasTable(props: Props) {
  let className = `${styles.container}`
  if (props.className) className += ` ${props.className}`
  const [customGas, setCustomGas] = useState(0)

  function getUsdValue(priceInLamports: number) {
    return ((priceInLamports * props.gasPrice) / 1e9) * props.solPrice
  }

  return (
    <article className={className}>
      <small className="muted">
        * At current fee of <strong>{props.gasPrice} lamports</strong>.
      </small>

      <table>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Lamports</th>
            <th>$ USD</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((i) => {
            return (
              <tr key={i.name}>
                <td>{i.name}</td>
                <td className={styles.right}>{i.cost.toLocaleString('en-US')}</td>
                <td className={styles.right}>${getUsdValue(i.cost).toFixed(2)}</td>
              </tr>
            )
          })}
          <tr>
            <td>Custom</td>
            <td className={styles.right}>
              <input
                className={styles.customInput}
                onChange={(e) => setCustomGas(Number(e.target.value))}
                autoComplete="off"
                placeholder="Fee cost in lamports"
              />
            </td>
            <td className={styles.right}>${getUsdValue(customGas).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </article>
  )
}
