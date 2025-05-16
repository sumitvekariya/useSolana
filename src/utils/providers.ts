import { Connection } from '@solana/web3.js'
import { NETWORKS } from 'services/indexer'

export function GetRpcProvider(network: NETWORKS = 'mainnet') {
  if (!process.env.NEXT_PUBLIC_HELIUS_API_KEY) {
    throw new Error('NEXT_PUBLIC_HELIUS_API_KEY env variable is not set.')
  }
  if (!process.env.NEXT_PUBLIC_QUICKNODE_API_KEY) {
    throw new Error('NEXT_PUBLIC_QUICKNODE_API_KEY env variable is not set.')
  }

  if (network === 'devnet') {
    return new Connection(`https://api.devnet.solana.com`)
  }
  if (network === 'testnet') {
    return new Connection(`https://api.testnet.solana.com`)
  }
  if (network === 'mainnet-beta') {
    return new Connection(`https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`)
  }

  return new Connection(`${process.env.NEXT_PUBLIC_QUICKNODE_API}`)
}
