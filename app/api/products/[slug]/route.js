// app/api/products/[slug]/route.js
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/dbConnect'

export async function GET(request, { params }) {
  try {
    const { slug } = params

    const product = await prisma.product.findUnique({
      where: { slug }
    })
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = params
    const data = await request.json()

    const product = await prisma.product.update({
      where: { slug },
      data: {
        ...data,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        price: parseFloat(data.price),
        stock: parseInt(data.stock)
      }
    })

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Error updating product:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = params

    await prisma.product.delete({
      where: { slug }
    })

    return NextResponse.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}