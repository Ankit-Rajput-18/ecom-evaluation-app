// server/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Add sample product trends
  await prisma.productTrend.createMany({
    data: [
      {
        productId: null, // you can link to a real Product.id if exists
        eventType: "created",
        title: "Sample Product A",
        price: 100,
        createdAt: new Date("2025-09-02"),
      },
      {
        productId: null,
        eventType: "viewed",
        title: "Sample Product B",
        price: 200,
        createdAt: new Date("2025-09-05"),
      }
    ],
  });

  // Add sample visitor logs
  await prisma.visitorLog.createMany({
    data: [
      { ip: "192.168.1.10", userAgent: "Chrome", createdAt: new Date("2025-09-03") },
      { ip: "192.168.1.11", userAgent: "Firefox", createdAt: new Date("2025-09-07") },
    ],
  });

  console.log("✅ Seed data inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
