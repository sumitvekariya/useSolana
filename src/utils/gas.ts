import fetch from 'cross-fetch'

export function toRoundedLamports(value: any) {
  // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
  return Math.round((Number(value ?? 0) / 1e9) * 100) / 100
}

export function getMin(numbers: Array<number>) {
  if (numbers.length === 0) return 0

  return numbers.sort((a, b) => a - b)[0]
}

export function getMax(numbers: Array<number>) {
  if (numbers.length === 0) return 0

  return numbers.sort((a, b) => b - a)[0]
}

export function getAverage(numbers: Array<number>) {
  if (numbers.length === 0) return 0

  return Math.round((numbers.reduce((a, b) => a + b) / numbers.length) * 100) / 100
}

export function getMedian(numbers: Array<number>) {
  if (numbers.length === 0) return 0

  let middle = Math.floor(numbers.length / 2)
  numbers = [...numbers].sort((a, b) => a - b)
  return numbers.length % 2 !== 0 ? numbers[middle] : (numbers[middle - 1] + numbers[middle]) / 2
}

export async function getSolPrice() {
  try {
    const response = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=SOL')
    const body = await response.json()

    if (body.data.rates.USD) {
      return body.data.rates.USD
    }
  } catch (e) {
    console.log('Unable to fetch price from coinbase..')
  }

  try {
    const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=SOL&tsyms=USD')
    const body = await response.json()

    if (body.USD) {
      return body.usdPrice
    }
  } catch (e) {
    console.log('Unable to fetch price from cryptocompare..')
  }

  return -1
}
