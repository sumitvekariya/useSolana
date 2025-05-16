---
title: "Understanding MEV and Validator Extraction on Solana"
description: "This tutorial explores Maximal Extractable Value (MEV) on Solana, how it differs from Ethereum, and the implications for users and developers."
authors: ["Solana Team"]
tags: ["DeFi", "Performance", "Security"]
languages: ["Solana", "Rust"]
url: "https://jito.network/blog/mev-extractors-validators-and-solanas-new-priority-fee-market/"
dateAdded: 2023-12-12
level: "Intermediate"
---

## Overview

Maximal Extractable Value (MEV) works differently on Solana compared to Ethereum due to fundamental differences in the blockchains' architectures. This guide explains how validators and extractors operate on Solana, the role of priority fees, and how developers can build applications that remain robust in this environment.

Key topics covered:

- How the Solana transaction processing flow enables different MEV extraction mechanisms
- The rise of Jito and MEV extraction infrastructure on Solana
- Priority fee markets and their impact on transaction ordering
- How developers can design applications that minimize MEV vulnerability
- Comparing Solana's MEV landscape with Ethereum's

This tutorial is essential for DeFi developers working on Solana who want to understand the economic implications of their protocol design. 