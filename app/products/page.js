import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import ErrorDisplay from '@/components/ErrorDisplay'
import prisma from '@/lib/dbConnect'

// render at request time so the build doesn't need a live database
export const dynamic = 'force-dynamic'

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

function ProductsGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <Link
          key={product.slug}
          href={`/products/${product.slug}`}
          className="group"
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <div className="relative h-64 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                ${product.price}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function LoadingProducts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-64 bg-gray-200" />
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>
      <Suspense fallback={<LoadingProducts />}>
        <ProductsList />
      </Suspense>
    </div>
  )
}

async function ProductsList() {
  try {
    const products = await getProducts()
    return <ProductsGrid products={products} />
  } catch (error) {
    return <ErrorDisplay />
  }
}
