---
title: "Building a Multisig Wallet on Solana"
description: "Learn how to implement a secure multisig wallet on Solana using program-derived addresses (PDAs) and threshold signatures for enhanced security and fund management."
authors: ["Solana Team"]
tags: ["Security", "Wallets", "Programming"]
languages: ["Rust", "TypeScript", "Solana"]
url: "https://github.com/coral-xyz/multisig/tree/master/programs/multisig"
dateAdded: 2023-09-15
level: "Intermediate"
---

## Overview

Multisig wallets are essential for secure management of shared funds in organizations, DAOs, and other collaborative entities. This tutorial shows how to build a robust multisig implementation on Solana.

Key topics covered:

- Designing a multisig architecture using Solana's account model
- Creating program-derived addresses (PDAs) for the multisig
- Implementing threshold signature validation
- Building proposal creation and approval workflows
- Transaction execution after threshold approval
- Security considerations and edge cases
- Testing your multisig implementation
- Building a simple UI for multisig management

Multisigs are an essential primitive for securing access to shared accounts. On Solana, multisigs can be implemented efficiently with low fees, making them practical even for smaller organizations. By the end of this tutorial, you'll have a functional multisig wallet that can be customized for various use cases. 