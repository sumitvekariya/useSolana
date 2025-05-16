---
title: "Indexing Solana Programs with Geyser Plugins"
description: "Learn how to index and query Solana program data using Geyser plugins, the Solana protocol's native indexing solution."
authors: ["Solana Team"]
tags: ["Development Tools", "Dapp", "Data Indexing"]
languages: ["TypeScript", "Rust", "Solana"]
url: "https://docs.solana.com/developing/plugins/geyser-plugins"
dateAdded: 2023-10-20
level: "Intermediate"
---

## Overview

Efficiently querying blockchain data is crucial for dApp development. This tutorial explores how to use Solana's Geyser plugins to create custom indexers that track and store program data for efficient querying.

Key topics covered:

- Understanding Solana's account model and why indexing is necessary
- Setting up a Geyser plugin to track program accounts and transactions
- Storing indexed data in a PostgreSQL database
- Creating a simple API to query the indexed data
- Performance considerations and optimization strategies
- Comparison with other indexing solutions like RPC methods

By the end of this tutorial, you'll understand how to build a custom indexing solution for any Solana program, enabling your dApp to quickly retrieve relevant on-chain data without expensive RPC calls. 