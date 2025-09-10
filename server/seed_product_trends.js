const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // sample product trend events across dates
  const rows = [
    { productId: null, eventType: 'created', title: 'Demo Shirt', price: 499, createdAt: new Date('2025-09-01') },
    { productId: null, eventType: 'created', title: 'Demo Hat', price: 199, createdAt: new Date('2025-09-02') },
    { productId: null, eventType: 'created', title: 'Demo Shoes', price: 2999, createdAt: new Date('2025-09-05') },
    { productId: null, eventType: 'created', title: 'Demo Bag', price: 999, createdAt: new Date('2025-09-07') }
  ];

  await prisma.productTrend.createMany({ data: rows, skipDuplicates: true });
  console.log('✅ Sample ProductTrend rows inserted');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
