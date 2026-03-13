# USSGL Account Lookup Tool

Simple browser-based tool for looking up USSGL account descriptions.

## What it does

- Accepts either:
  - a direct USSGL account number (`211000`),
  - a natural-language question (`What is USSGL 101000?`), or
  - description keywords (`accounts payable`)
- Returns matching account description(s)
- Match modes:
  - `Smart` (ranked natural-language search)
  - `Exact` (exact account/description match)
  - `Contains` (substring match)
- Supports loading a full USSGL CSV export to replace the built-in starter list
- Can export current results to CSV
- Can print current results

## Run

Open `index.html` in your browser.

## CSV import

If you have an official USSGL dataset, import it with headers such as:

- Account column: `account`, `ussgl`, `account_number`, `number`
- Description column: `description`, `title`, `name`

The tool will parse valid 6-digit account rows and use them for search.
