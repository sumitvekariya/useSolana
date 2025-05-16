---
title: "What Happens When You Send 1 SOL"
description: "A detailed exploration of Solana's transaction flow, explaining what happens under the hood when you transfer SOL from one wallet to another."
authors: ["Solana Team"]
tags: ["Architecture", "Wallets", "Security"]
languages: ["Solana"]
url: "https://solana.com/docs/core/transactions"
dateAdded: 2024-02-10
level: "Intermediate"
---

## Overview

You have 1 SOL in your wallet. You open your wallet app, enter a recipient address, specify the amount, and hit send. A few seconds later, the transaction is confirmed. But what exactly happened during those few seconds?

This tutorial breaks down the entire process of a SOL transfer on Solana, from transaction construction to consensus and finality, including:

- How your wallet constructs the transaction (account addresses, Lamports, signatures)
- How transactions are serialized and sent to the network
- The role of the System Program in processing transfers
- How validators verify, process, and include your transaction in a block
- How Solana's Proof of History and tower BFT consensus ensure transaction finality
- Transaction prioritization and fees on Solana

Understanding this process helps developers build more secure applications and provides deeper insight into Solana's architecture. 