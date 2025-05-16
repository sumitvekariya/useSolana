module.exports = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 180,
  images: {
    domains: ['dl.airtable.com', 'avatars.githubusercontent.com', 'camo.githubusercontent.com', 'www.datocms-assets.com', 'acegif.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }

    return config
  },
  async redirects() {
    return [
      // {
      //   source: '/gas',
      //   destination: 'https://dune.com/lily212/solana-fee-tracker',
      //   permanent: true,
      // },
    ]
  },
}
