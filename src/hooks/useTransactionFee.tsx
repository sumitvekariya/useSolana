import { useEffect, useState } from 'react'
import { useInterval } from './useInterval'
import { GetRpcProvider } from 'utils/providers'

export function useTransactionFee(network: string = '', interval: number = 12000) {
  const [feeRate, setFeeRate] = useState<number>(0)
  const [priorityFee, setPriorityFee] = useState<number>(0)

  useEffect(() => {
    async function asyncEffect() {
      await trySetPrice()
    }

    asyncEffect()
  }, [])

  useInterval(async () => {
    await trySetPrice()
  }, interval)

  async function trySetPrice() {
    try {
      const connection = GetRpcProvider(network as any)

      // Solana has a fixed base fee of 5000 lamports
      const baseFee = 5000

      // Get recent performance samples to estimate current network load
      const perfSamples = await connection.getRecentPerformanceSamples(5)

      if (perfSamples && perfSamples.length > 0) {
        // Calculate average TPS (transactions per second)
        const averageTxPerSlot =
          perfSamples.reduce((sum: number, sample) => sum + sample.numTransactions / sample.samplePeriodSecs, 0) / perfSamples.length

        // Estimated priority fee based on network congestion
        // This is an approximation as Solana doesn't require priority fees like Ethereum
        // but validators may prioritize transactions with higher fees during congestion
        const estimatedPriorityFee = Math.ceil(averageTxPerSlot / 10) * 100

        setFeeRate(baseFee)
        setPriorityFee(estimatedPriorityFee)
      } else {
        // Fallback to base values if we can't get performance samples
        setFeeRate(baseFee)
        setPriorityFee(0)
      }
    } catch (e) {
      console.log('ERROR', e)
      console.log('UNABLE TO FETCH FEE DATA')
      // Unable to fetch fee data - set default values
      setFeeRate(5000)
      setPriorityFee(0)
    }
  }

  return { feeRate, priorityFee }
}
