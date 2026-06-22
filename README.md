# crypto-price-notifier

A serverless application that queries cryptocurrency prices and sends email notifications. Built with Node.js, TypeScript, and AWS (Lambda, API Gateway, DynamoDB, SES).

## Architecture

```
POST /price        →  Lambda (MS1)  →  CoinGecko API (fetch price)
                                    →  SES (send email)
                                    →  DynamoDB (save history)

GET /history       →  Lambda (MS2)  →  DynamoDB (read history)
```

## Tech Stack

- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Serverless Framework v3
- **AWS Services:** Lambda, API Gateway (REST), DynamoDB, SES
- **Testing:** Jest
- **CI/CD:** GitHub Actions

## Prerequisites

- Node.js >= 18
- AWS CLI configured (`aws configure`)
- AWS SES email verified (sandbox mode requires both sender and recipient to be verified)

## Local Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format
npm run format
```

## Deployment

```bash
# Deploy to dev
SES_FROM_EMAIL=your@email.com npx serverless@3 deploy --stage dev

# Remove stack
npx serverless@3 remove --stage dev
```

## API Documentation

### MS1 — Query Crypto Price and Send Email

**Endpoint**

```
POST /price
```

**Request Body**

```json
{
  "coin": "bitcoin",
  "email": "user@example.com"
}
```

**Success Response** `200`

```json
{
  "success": true,
  "data": {
    "coin": "bitcoin",
    "currency": "usd",
    "price": 67432.21,
    "email": "user@example.com",
    "emailSent": true,
    "historySaved": true,
    "lastUpdatedAt": 1234567890
  }
}
```

**Error Responses**

| Status | Code               | Description                      |
| ------ | ------------------ | -------------------------------- |
| 400    | VALIDATION_ERROR   | Missing or invalid coin/email    |
| 404    | COIN_NOT_FOUND     | Coin does not exist on CoinGecko |
| 502    | EXTERNAL_API_ERROR | CoinGecko API unavailable        |
| 500    | INTERNAL_ERROR     | Unexpected server error          |

---

### MS2 — Get Search History

**Endpoint**

```
GET /history
```

**Success Response** `200`

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "email": "user@example.com",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "coin": "bitcoin",
        "price": 67432.21,
        "currency": "usd"
      }
    ]
  }
}
```

**Error Responses**

| Status | Code           | Description             |
| ------ | -------------- | ----------------------- |
| 500    | INTERNAL_ERROR | Unexpected server error |

---

### Health Check

**Endpoint**

```
GET /health
```

**Success Response** `200`

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "crypto-price-notifier"
  }
}
```

## DynamoDB Schema

```
Table: crypto-price-notifier-dev-price-history
PK: email (String)       # partition key
SK: createdAt (String)   # sort key, ISO 8601 format
Attributes:
  - coin: String
  - price: Number
  - currency: String
```

## Environment Variables

| Variable            | Description                                      | Required |
| ------------------- | ------------------------------------------------ | -------- |
| SES_FROM_EMAIL      | Sender email address (must be verified in SES)   | Yes      |
| PRICE_HISTORY_TABLE | DynamoDB table name (auto-set by serverless.yml) | Yes      |

## CI/CD

Two GitHub Actions workflows:

- **CI** (`ci.yml`) — runs on every push: format check, lint, test, build
- **Deploy** (`deploy.yml`) — runs on push to main: CI steps + deploy to dev

### Required GitHub Secrets

| Secret                | Description                 |
| --------------------- | --------------------------- |
| AWS_ACCESS_KEY_ID     | IAM user access key         |
| AWS_SECRET_ACCESS_KEY | IAM user secret key         |
| AWS_REGION            | AWS region (ap-southeast-2) |
| SES_FROM_EMAIL        | Verified sender email       |

## Testing the API

### Query Crypto Price and Send Email

```bash
curl -X POST https://xaeexa8kjd.execute-api.ap-southeast-2.amazonaws.com/dev/price \
  -H "Content-Type: application/json" \
  -d '{"coin":"bitcoin","email":"felikslyu@gmail.com"}'
```

### Get Search History

```bash
curl https://xaeexa8kjd.execute-api.ap-southeast-2.amazonaws.com/dev/history
```
