'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = async () => {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product._id, quantity: 1 }),
    })

    if (res.ok) {
      toast.success(`${product.name} added to cart!`)
    } else {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <Link href={`/products/${product.slug}`} className="group">
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
  )
}
