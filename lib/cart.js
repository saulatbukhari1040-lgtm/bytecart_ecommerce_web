import prisma from './dbConnect';

export async function addToCart(userId, productId) {
  try {
    // Find or create cart for user
    let cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {}
    });

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId
        }
      }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: 1
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: 'Failed to add item to cart' };
  }
}

export async function getCart(userId) {
  try {
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

    return { success: true, data: cart };
  } catch (error) {
    console.error('Error getting cart:', error);
    return { success: false, error: 'Failed to get cart' };
  }
}

export async function updateCartItem(userId, productId, quantity) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });
    if (!cart) {
      return { success: false, error: 'Cart not found' };
    }

    // Find the product by slug
    const product = await prisma.product.findUnique({
      where: { slug: productId }
    });
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    const item = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id
        }
      }
    });

    if (!item) {
      return { success: false, error: 'Item not found in cart' };
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: item.id }
      });
    } else {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating cart:', error);
    return { success: false, error: 'Failed to update cart' };
  }
}

export async function removeFromCart(userId, productId) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });
    if (!cart) {
      return { success: false, error: 'Cart not found' };
    }

    // Find the product by slug
    const product = await prisma.product.findUnique({
      where: { slug: productId }
    });
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: product.id
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error: 'Failed to remove item from cart' };
  }
}