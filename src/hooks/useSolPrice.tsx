import { useEffect, useState } from 'react'
import { useInterval } from './useInterval'

export function useSolPrice(interval: number = 12000) {
  const [price, setPrice] = useState<number>(0)

  useEffect(() => {
    async function asyncEffect() {
      await trySetPrice()
    }

    asyncEffect()
  }, [])

  useInterval(async () => {
    console.log('Updating SOL price', price)
    await trySetPrice()
  }, interval)

  async function trySetPrice() {
    try {
      // First try CoinGecko API (most reliable)
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
      const body = await response.json()
      if (body.solana && body.solana.usd) {
        setPrice(body.solana.usd)
        return
      }
    } catch (e) {
      console.log('Unable to fetch price from CoinGecko, trying alternatives...')
    }

    try {
      // Fallback to CryptoCompare API
      const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=SOL&tsyms=USD')
      const body = await response.json()
      if (body.USD) {
        setPrice(body.USD)
        return
      }
    } catch (e) {
      console.log('Unable to fetch price from CryptoCompare...')
    }

    try {
      // Last resort: Coinbase API
      const response = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=SOL')
      const body = await response.json()
      if (body.data && body.data.rates && body.data.rates.USD) {
        setPrice(Number(body.data.rates.USD))
        return
      }
    } catch (e) {
      console.log('Unable to fetch price from Coinbase...')
    }

    // If we've reached here, all APIs failed
    if (price === 0) {
      // If we don't have a price yet, use a fallback value
      setPrice(20) // Use a reasonable default SOL price
      console.log('Using fallback SOL price')
    }
    // Otherwise, keep the last known good price
  }

  return price
}
