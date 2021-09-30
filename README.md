# Solana Escrow FE Client

## What is?
FE Client for: https://paulx.dev/blog/2021/01/14/programming-on-solana-an-introduction/ \
Based on: https://github.com/metadiego/solana-escrow-fe

## To run:

#### `npm install`

Install all required dependencies

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Notes:
This FE is hardcoded to connect to a Soalana Verifier running on your localhost. To update
the Soalana network that this client runs on:
1. Update line 6 on initEscrow.ts
2. Update line 6 on takeTrade.ts
