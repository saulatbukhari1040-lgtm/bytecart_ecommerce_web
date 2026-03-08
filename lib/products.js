import prisma from './dbConnect';

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: products };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, error: 'Failed to fetch products' };
  }
}

export async function getProduct(slug) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug }
    });

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { success: false, error: 'Failed to fetch product' };
  }
}

export async function createProduct(data) {
  try {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-');
    const product = await prisma.product.create({
      data: { ...data, slug }
    });

    return { success: true, data: product };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProduct(id, data) {
  try {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-');
    const product = await prisma.product.update({
      where: { id },
      data: { ...data, slug }
    });

    return { success: true, data: product };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id) {
  try {
    await prisma.product.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}