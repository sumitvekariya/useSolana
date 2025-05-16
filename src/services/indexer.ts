import { GasFee } from 'types/gas'
import { Connection } from '@solana/web3.js'

export type NETWORKS = 'mainnet' | 'devnet' | 'testnet' | 'mainnet-beta'

const NETWORK_URLS = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
}

export async function GetGasData(network: NETWORKS = 'mainnet') {
  console.log('Get GasData', network)

  try {
    // Create a direct connection to Solana network
    const connection = new Connection(NETWORK_URLS[network], 'confirmed')

    // Get recent block data to calculate fees
    const blocks = []
    const recentPerformanceSamples = await connection.getRecentPerformanceSamples(20)

    // Get current Solana price from CoinGecko
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
    const priceData = await priceResponse.json()
    const solPrice = priceData.solana?.usd || 20 // Default to 20 if API fails

    // Get recent block data
    for (let i = 0; i < recentPerformanceSamples.length; i++) {
      const sample = recentPerformanceSamples[i]
      const date = new Date(sample.slot * 400) // Approximate timestamp based on slot (Solana target 400ms per slot)

      // Create data in the format our app expects
      blocks.push({
        blockNr: sample.slot,
        period: date.toISOString(),
        baseFee: 5000, // Base fee in lamports
        gasLimit: 0, // Not applicable to Solana
        gasUsed: 0, // Not applicable to Solana
        min: 5000, // Minimum fee
        median: sample.numTransactions > 0 ? 5000 + Math.floor(sample.numTransactions / 5) * 1000 : 5000, // Estimate based on congestion
        solPrice,
      })
    }

    // Calculate average base fee from all samples
    const average = blocks.reduce((sum, block) => sum + block.baseFee, 0) / blocks.length

    return {
      lastHour: Math.round(average * 100) / 100,
      fees: blocks,
    }
  } catch (error) {
    console.error('Error:', error)
  }

  // Fallback with minimal data if API call fails
  return {
    lastHour: 5000,
    fees: [],
  }
}

export async function GetAverage(period: 'hour' | 'day', limit: number = 24, network: NETWORKS = 'mainnet') {
  console.log(`[${network}] Get average by ${period}`)

  try {
    const connection = new Connection(NETWORK_URLS[network], 'confirmed')
    const performanceSamples = await connection.getRecentPerformanceSamples(limit)
    let solPrice = 20 // Default price

    // Try to get current SOL price
    try {
      const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
      const priceData = await priceResponse.json()
      if (priceData.solana?.usd) {
        solPrice = priceData.solana.usd
      }
    } catch (e) {
      console.log('Unable to fetch SOL price for heatmap data')
    }

    // Create mock data in the format expected by the Heatmap component
    const mockData: GasFee[] = []
    
    // Days of the week abbreviated
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const currentDate = new Date()
    const currentDay = currentDate.getDay() // 0-6 where 0 is Sunday
    
    // Generate 24 hours of data for each day of the week
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        // Add some randomness for each day of the week
        const dayFactor = d * 0.05 // 5% variation per day
        const hourFactor = Math.abs((h - 12) / 24) * 0.5 // Higher fees during midday
        
        // Generate a date for this hour and day
        const date = new Date(currentDate)
        date.setDate(date.getDate() - ((currentDay + 6) % 7) + d)
        date.setHours(h, 0, 0, 0)
        
        // Use performance sample data if available for this hour, or generate random but realistic data
        // Each day should have different values for the same hour
        const defaultTxCount = 1000 + (d * 50) + (Math.sin(h / 3.82) * 500)
        const sampleForHour = performanceSamples.find((s, idx) => idx % 24 === h)
        const txCount = sampleForHour ? sampleForHour.numTransactions * (0.8 + (d * 0.05)) : defaultTxCount
        
        // Calculate a median fee based on transaction count
        // Solana base fees are ~5000 lamports, with slight variations based on network congestion
        const baseFee = 5000
        const congestionMultiplier = 1 + (txCount / 10000) * (0.1 + dayFactor + hourFactor)
        const medianFee = Math.floor(baseFee * congestionMultiplier)
        
        mockData.push({
          blockNr: date.getTime(), // Use timestamp as block number
          period: date.toISOString(),
          baseFee,
          gasLimit: 0,
          gasUsed: 0,
          min: baseFee,
          median: medianFee,
          solPrice
        })
      }
    }
    
    return mockData
  } catch (error) {
    console.error('Error:', error)
    
    // If all fails, return minimal mock data
    const mockFees: GasFee[] = []
    const now = new Date()
    
    // Create at least one data point for the current hour/day
    mockFees.push({
      blockNr: now.getTime(),
      period: now.toISOString(),
      baseFee: 5000,
      gasLimit: 0,
      gasUsed: 0,
      min: 5000,
      median: 5000,
      solPrice: 20
    })
    
    return mockFees
  }
}
