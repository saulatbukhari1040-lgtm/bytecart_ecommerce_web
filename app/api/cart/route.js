import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/dbConnect';

export async function POST(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();
    const parsedQuantity = parseInt(quantity);

    if (!productId || !parsedQuantity || parsedQuantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid product or quantity' },
        { status: 400 }
      );
    }

    // Find product by slug
    const product = await prisma.product.findUnique({
      where: { slug: productId }
    });
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check stock
    if (product.stock < parsedQuantity) {
      return NextResponse.json({
        success: false,
        error: `Only ${product.stock} items available in stock`
      }, { status: 400 });
    }

    // Upsert cart for user
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {}
    });

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id
        }
      }
    });

    if (existingItem) {
      const quantityDiff = parsedQuantity - existingItem.quantity;
      if (product.stock < quantityDiff) {
        return NextResponse.json({
          success: false,
          error: `Only ${product.stock} additional items available in stock`
        }, { status: 400 });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: parsedQuantity }
      });

      // Update product stock
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: product.stock - quantityDiff }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: parsedQuantity
        }
      });

      // Update product stock
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: product.stock - parsedQuantity }
      });
    }

    // Return updated cart with products
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

    return NextResponse.json({ success: true, data: updatedCart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    if (!cart) {
      return NextResponse.json({ success: true, data: { items: [] } });
    }

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();
    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    const { updateCartItem } = await import('@/lib/cart');
    const result = await updateCartItem(userId, productId, quantity);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in cart API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    if (!cart) {
      return NextResponse.json({ success: true, data: { items: [] } });
    }

    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      // No body means clear entire cart
    }

    const { productId } = body;

    if (productId) {
      // Find product by slug
      const product = await prisma.product.findUnique({
        where: { slug: productId }
      });
      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      // Find the cart item to return stock
      const cartItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: product.id
          }
        }
      });

      if (cartItem) {
        // Return quantity to stock
        await prisma.product.update({
          where: { id: product.id },
          data: { stock: product.stock + cartItem.quantity }
        });

        // Delete the cart item
        await prisma.cartItem.delete({
          where: { id: cartItem.id }
        });
      }
    } else {
      // Clear entire cart — return all quantities to stock
      for (const item of cart.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        });
      }

      // Delete all cart items
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

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

    return NextResponse.json({ success: true, data: updatedCart || { items: [] } });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}