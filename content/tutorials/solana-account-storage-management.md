---
title: "Understanding Solana's Account Storage Model"
description: "A deep dive into how Solana's account model works for data storage, explaining program-derived addresses, account sizing, and efficient data management patterns."
authors: ["Solana Team"]
tags: ["Architecture", "Performance", "Programming"]
languages: ["Rust", "Solana"]
url: "https://docs.anza.xyz/implemented-proposals/rent"
dateAdded: 2023-10-25
level: "Intermediate"
---

## Overview

Solana's account model is fundamentally different from Ethereum's storage model. Instead of a persistent key-value store, Solana uses a collection of owned accounts to store program state. This tutorial explores how storage works on Solana and how to design efficient data structures.

Key topics covered:

- The basics of Solana's account model for program storage
- How to create and size accounts appropriately
- Designing efficient data layouts with borsh serialization
- Program-Derived Addresses (PDAs) and how they're used for storage
- Managing account rent and rent exemption
- Realloc functionality for resizing accounts
- Storage optimization patterns and performance considerations

Understanding Solana's storage model is crucial for developing efficient programs. Unlike EVM chains where storage is a simple but expensive key-value store, Solana requires more careful planning of your data structures, but rewards this with significantly lower costs and higher throughput. 