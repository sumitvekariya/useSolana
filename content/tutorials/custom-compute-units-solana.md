---
title: "Optimizing Compute Units for Solana Programs"
description: "Learn how to manage Solana's compute budget, prioritize transactions, and optimize your program's execution efficiency to avoid compute unit limits."
authors: ["Solana Team"]
tags: ["Performance", "Programming", "Optimization"]
languages: ["Rust", "TypeScript", "Solana"]
url: "https://solana.com/developers/guides/advanced/how-to-request-optimal-compute"
dateAdded: 2024-03-19
level: "Advanced"
---

## Overview

Every transaction on Solana consumes compute units (CU), a measure of computational resources used during execution. Understanding how to manage and optimize these resources is critical for building efficient Solana programs.

Key topics covered:

- Understanding Solana's compute budget and limits
- How to set custom compute budgets for complex transactions
- Measuring compute unit consumption in your programs
- Techniques to reduce compute unit usage through code optimization
- Using compute unit prices for transaction prioritization
- Common causes of "out of compute units" errors and how to solve them
- Best practices for balancing compute usage and transaction costs

This guide is essential for developers working on complex Solana programs that push the boundaries of on-chain computation. By optimizing your program's compute usage, you can create more powerful applications that remain efficient and cost-effective for users. 