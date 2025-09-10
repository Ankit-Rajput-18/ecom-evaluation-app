# Implementation Documentation

## 📌 Objective
This assignment implements analytics features in the **E-commerce Evaluation App**.  
The goal was to track product trends and visitor activity, with APIs supporting date range and bucket-based filtering (`day`, `week`, `month`).

---

## 🛠️ Schema Changes
New tables were added to support analytics:

### `ProductTrend`
Tracks product-related events (e.g., creation) with timestamps.

```prisma
model ProductTrend {
  id        Int      @id @default(autoincrement())
  productId String?
  product   Product? @relation(fields: [productId], references: [id], onDelete: Cascade)
  eventType String   @default("created")
  title     String?
  price     Int?
  createdAt DateTime @default(now())

  @@index([createdAt])
  @@index([productId])
}

model VisitorLog {
  id        Int      @id @default(autoincrement())
  ip        String
  userAgent String?
  createdAt DateTime @default(now())

  @@index([createdAt])
  @@index([ip])
}
  

🌐 API Endpoints

1. Product Trends
GET /api/dashboard/products?bucket=day&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

**Localhost Testing URL:**  
`http://localhost:3001/api/dashboard/products?bucket=day&startDate=2025-09-01&endDate=2025-09-10

Sample Request
GET /api/dashboard/products?bucket=day&startDate=2025-09-01&endDate=2025-09-10

Sample Response
{
  "success": true,
  "bucket": "day",
  "data": [
    {
      "startDate": "2025-09-01",
      "endDate": "2025-09-01",
      "totalProducts": 1
    },
    {
      "startDate": "2025-09-02",
      "endDate": "2025-09-02",
      "totalProducts": 2
    },
    {
      "startDate": "2025-09-05",
      "endDate": "2025-09-05",
      "totalProducts": 2
    },
    {
      "startDate": "2025-09-07",
      "endDate": "2025-09-07",
      "totalProducts": 1
    }
  ]
}


 2. Visitors Tracking

**Endpoint (relative):**  
`GET /api/dashboard/visitors?bucket=day&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

**Localhost Testing URL:**  
`http://localhost:3001/api/dashboard/visitors?bucket=day&startDate=2025-09-01&endDate=2025-09-10`


Sample Request:GET /api/dashboard/visitors?bucket=day&startDate=2025-09-01&endDate=2025-09-10

Sample Response: 
{
  "success": true,
  "bucket": "day",
  "data": [
    {
      "startDate": "2025-09-03",
      "endDate": "2025-09-03",
      "totalVisits": 1,
      "uniqueVisitors": 1
    },
    {
      "startDate": "2025-09-07",
      "endDate": "2025-09-07",
      "totalVisits": 1,
      "uniqueVisitors": 1
    }
  ]
}


## ▶️ How to Run

1. Install dependencies:
   ```bash
   cd server
   npm install


## Setup DB & run migrations:
npx prisma migrate dev --schema=server/prisma/schema.prisma


## Start server:
npx nodemon server/app.js


## Test APIs in browser or Postman:
http://localhost:3001/api/dashboard/products?bucket=day&startDate=2025-09-01&endDate=2025-09-10

http://localhost:3001/api/dashboard/visitors?bucket=day&startDate=2025-09-01&endDate=2025-09-10