# jokerace • [![Forge Tests](https://github.com/jk-labs-inc/jokerace/actions/workflows/forge_tests.yml/badge.svg)](https://github.com/JokeDAO/JokeDaoV2Dev/actions/workflows/forge_tests.yml)

Check out the live site at [jokerace.io](https://jokerace.io/)!

## Pre-requisites
- `yarn` installed
- `node` version >= `17.0.0`
- Have an Ethereum wallet (like MetaMask for instance)

## Before you start
- Install dependencies with `yarn install`
- Create a `.env` file in `packages/react-app-revamp` (the frontend package) and paste the following values:

Required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_R2_ACCOUNT_ID=
NEXT_PUBLIC_R2_ACCESS_KEY_ID=
NEXT_PUBLIC_R2_SECRET_ACCESS_KEY=
NEXT_PUBLIC_MERKLE_TREES_BUCKET=
```

Optional
```
NEXT_PUBLIC_ALCHEMY_KEY=
NEXT_PUBLIC_ETHERSCAN_KEY=
NEXT_PUBLIC_IMAGE_UPLOAD_BUCKET=
```
## Getting Started

First, navigate to the top directory of this repo and run the development server with

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Development Notes

### Updating bytecode

Whenever you make a change to smart contracts or really whenever the bytecode files change (could be that [the compiler version got changed and so no bytecode changed, but remappings were reformatted](https://github.com/jk-labs-inc/jokerace/pull/509)), increment the version by `x.1`. Then generate the bytecode and version it as described below.

The purpose of this is so that we have a way to tell exactly what bytecode a contract that we read from a chain has and exactly how it was deployed given its version number.

In order to generate and/or update the bytecode of your project, run 

```bash
yarn smartcheck
```

Upon a successful `forge fmt`, `forge test -vv`, and `forge build` of the smart contract code, this will copy the generated bytecode and ABI into the `react-app-revamp` (the frontend) package so that the app can access it.

You will also need to do two more things if the ABI is changed:
  - Make a copy of the bytecode and abi in the versioning folder `packages/react-app-revamp/contracts/bytecodeAndAbi` by copying the content in `Contest.sol`, which is the latest version of bytecode, into a new folder in `contracts/bytecodeAndAbi` and renaming that folder with the incremented version following the convention.
  - Update ABI parser code in `packages/react-app-revamp/helpers/getContestContractVersion.ts` to use the new version if a contract's `version()` function returns the value of your newly incremented version.
  - Repeat the above 2 steps for `RewardsModule.sol` as well if that has changed.
  
[Here](https://github.com/jk-labs-inc/jokerace/pull/111/commits/79072b212e603bcca0418dd5057557379444194f) is an example PR that does all of these steps.

*Make sure to do all of these steps before committing any changes to the contract code to make sure that the bytecode that the site is deploying is the same as what you have written in the `forge` package! It is also important that the site is able to correctly version a given deployed contract's ABI when reading from it.*

## Audits

Our smart contracts were audited by Certik in September 2023, the audit report is available [here](https://github.com/jk-labs-inc/jokerace-audits/blob/main/audit-reports/Sept23_Certik_Final_Report.pdf).

## Built with
- NextJS
- Tailwind CSS & Headless-UI
- ethers, wagmi, @wagmi/core, @rainbow-me/rainbowkit
- zustand
- [Vercel](https://vercel.com/?utm_source=jokedao&utm_campaign=oss).

jokerace front-end is hosted on [Vercel](https://vercel.com/?utm_source=jokedao&utm_campaign=oss).
