---
title: "Building DeFi Applications with Jupiter Swap SDK"
description: "Learn how to integrate Jupiter, Solana's leading swap aggregator, into your DeFi applications for optimal token swaps across all Solana liquidity sources."
authors: ["Solana Team"]
tags: ["DeFi", "SDK", "Programming"]
languages: ["TypeScript", "Solana"]
url: "https://dev.jup.ag/docs/development-basics#interacting-with-solana"
dateAdded: 2024-01-15
level: "Intermediate"
---

## Overview

Jupiter is Solana's primary swap aggregator, routing trades through all available liquidity sources to find the best prices. This tutorial shows you how to integrate Jupiter into your Solana applications for token swaps.

Key topics covered:

- Setting up the Jupiter SDK in your TypeScript application
- Fetching token information and available routes
- Executing swaps with the best routing
- Building a simple swap interface with price quotes
- Handling slippage and transaction confirmation
- Working with Jupiter's V6 API for advanced use cases
- Integrating limit orders and dollar cost averaging (DCA)

Jupiter processes over 10 million transactions weekly and handles a significant portion of all Solana DEX volume. By integrating Jupiter into your application, you'll provide users with the best possible swap experience, accessing deep liquidity across the entire Solana ecosystem. 