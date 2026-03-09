// app/api/products/cart/route.js
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/dbConnect';

export async function GET() {
  const { userId } = auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return Response.json(cart || { items: [] });
}

export async function POST(request) {
  const { userId } = auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { productId, quantity } = await request.json();

  // Upsert cart
  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {}
  });

  // Upsert cart item
  await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: productId
      }
    },
    create: {
      cartId: cart.id,
      productId: productId,
      quantity: quantity
    },
    update: {
      quantity: {
        increment: quantity
      }
    }
  });

  // Return updated cart
  const updatedCart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return Response.json(updatedCart);
}