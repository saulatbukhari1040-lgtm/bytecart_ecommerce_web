// scripts/seed.js
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'MacBook Pro',
    description: 'The most powerful MacBook Pro ever is here. With the blazing-fast M1 Pro or M1 Max chip — the first Apple silicon designed for pros.',
    price: 1299.99,
    stock: 50,
    image: '/MacBook Pro.png',
    details: '14-inch Liquid Retina XDR display, M1 Pro chip, 16GB unified memory, 512GB SSD storage',
    slug: 'macbook-pro',
    category: 'laptops'
  },
  {
    name: 'iPhone 13 Pro',
    description: 'A dramatically more powerful camera system. A display so responsive, every interaction feels new again.',
    price: 999.99,
    stock: 100,
    image: '/iPhone 16 Pro.png',
    details: '6.1-inch Super Retina XDR display, A15 Bionic chip, 128GB storage',
    slug: 'iphone-13-pro',
    category: 'phones'
  },
  {
    name: 'iPad Pro',
    description: 'Supercharged by the M1 chip, iPad Pro delivers epic performance and capabilities.',
    price: 799.99,
    stock: 75,
    image: '/iPad Pro.png',
    details: '12.9-inch Liquid Retina XDR display, M1 chip, 128GB storage',
    slug: 'ipad-pro',
    category: 'tablets'
  },
  {
    name: 'AirPods Pro',
    description: 'Active Noise Cancellation for immersive sound. Transparency mode for hearing the world around you.',
    price: 249.99,
    stock: 200,
    image: '/AirPods 4 with Anc.png',
    details: 'Active Noise Cancellation, Transparency mode, Spatial Audio, Sweat and water resistant',
    slug: 'airpods-pro',
    category: 'accessories'
  },
  {
    name: 'Apple Watch Series 7',
    description: 'The most advanced Apple Watch features our largest and most advanced display yet.',
    price: 399.99,
    stock: 80,
    image: '/Apple Watch Series 10.png',
    details: 'Always-On Retina display, GPS, Heart rate monitor, Water resistant',
    slug: 'apple-watch-series-7',
    category: 'watches'
  }
];

async function seed() {
  try {
    console.log('Starting database seed...');

    // Clear existing products (and cart items via cascade)
    console.log('Clearing existing data...');
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.product.deleteMany({});
    console.log('Cleared existing data');

    // Insert new products
    console.log('Inserting products...');
    for (const product of products) {
      await prisma.product.create({ data: product });
    }

    // Verify
    const count = await prisma.product.count();
    console.log(`Successfully inserted ${count} products`);

    const allProducts = await prisma.product.findMany();
    console.log('Products in database:');
    allProducts.forEach(product => {
      console.log(`- ${product.name} (${product.slug})`);
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();