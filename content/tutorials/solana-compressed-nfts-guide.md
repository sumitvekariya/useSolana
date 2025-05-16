---
title: "Building Scalable NFT Collections with Compressed NFTs"
description: "Learn how to create, mint, and manage state-compressed NFTs on Solana to reduce costs and increase scalability for large collections."
authors: ["Solana Team"]
tags: ["NFTs", "Scalability", "Metaplex"]
languages: ["TypeScript", "Rust", "Solana"]
url: "https://docs.metaplex.com/programs/compression/getting-started"
dateAdded: 2024-02-15
level: "Intermediate"
---

## Overview

Solana's compressed NFTs use state compression through Merkle trees to drastically reduce the cost of creating and managing large NFT collections. This tutorial explains how to implement compressed NFTs for your project.

Key topics covered:

- Understanding the difference between traditional and compressed NFTs
- How state compression works using concurrent merkle trees
- Setting up a compression collection with Metaplex
- Minting compressed NFTs at scale with minimal costs
- Transferring and managing compressed NFTs
- Verifying compressed NFT ownership and metadata
- Building applications that support both traditional and compressed NFTs

Compressed NFTs can reduce the cost of minting from ~0.012 SOL to as little as 0.000005 SOL per NFT, enabling collections with millions of items. This guide will show you how to leverage this technology to build highly scalable NFT projects that were previously cost-prohibitive. 