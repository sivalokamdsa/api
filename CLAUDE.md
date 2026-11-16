# CLAUDE.md

Guidance for working in this repository.

## Overview

A small Node.js/Express backend that creates and verifies Razorpay payments for a ₹499 course purchase. The entire app is a single file, `server.js`.

## Stack

- Node.js, CommonJS (`"type": "commonjs"`)
- Express 5 (`express.json()` body parsing)
- `razorpay` SDK for order creation
- `dotenv` for loading `.env`
- Node's built-in `crypto` for HMAC signature checks

There is no build step, no TypeScript, and no test suite yet.

## Commands

- Install: `npm install`
- Run: `node server.js` (there is no `start` script in `package.json`)
- Test: none. The `test` script is a placeholder that exits with an error.

## Configuration

`server.js` loads `.env` via `dotenv`. Variables referenced in the code:

- `RAZORPAY_KEY_ID`: Razorpay public key ID, passed to the SDK
- `RAZORPAY_KEY_SECRET`: Razorpay secret, used by the SDK and for HMAC verification

`.env` also defines `PORT`, but `server.js` does not read it. The port is hardcoded to `3000`.

`.env` is gitignored. Never commit it, and never print or copy its secret values into code, docs, or chat.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/create-order` | Creates a Razorpay order for 49900 paise (₹499, INR). Returns the Razorpay order object as JSON. |
| POST | `/api/verify-payment` | Body: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`. Recomputes HMAC-SHA256 of `order_id|payment_id` with `RAZORPAY_KEY_SECRET` and compares it to the signature. Returns `{ success: true }` on match, otherwise HTTP 400 with `{ success: false }`. |

## Known gaps

- `/api/verify-payment` only checks the signature. The "mark course as paid for this user" step is a TODO comment. There is no user model or persistence yet.
- `/api/create-order` has no try/catch. A Razorpay failure will produce an unhandled promise rejection.
- The signature comparison uses `===`. A timing-safe comparison (`crypto.timingSafeEqual`) is preferable.
- No input validation on the request bodies.
- `PORT` in `.env` is ignored.
- `README.md` contains only the title.

## Conventions and cautions

- Keep the amount (`49900`) and currency in one place if pricing changes.
- Any change to `verify-payment` must keep the signature check ahead of any "mark as paid" logic. Never grant access on an unverified payment.
- Keep secrets in environment variables only.
