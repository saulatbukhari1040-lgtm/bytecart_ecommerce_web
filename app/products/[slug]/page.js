'use client'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

async function getProduct(slug) {
  try {
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: 'no-store',
    })
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error('Failed to fetch product')
    }
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default function ProductPage({ params }) {
  const { user, isSignedIn } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    getProduct(params.slug).then(data => {
      if (!data) {
        notFound()
      }
      setProduct(data)
      setFetching(false)
    })
  }, [params.slug])

  if (fetching || !product) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
  }

  const handleAddToCart = async () => {
    if (!isSignedIn) {
      toast.error('Please sign in to add items to cart')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.slug,
          quantity: 1
        }),
      })

      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      toast.success(`${product.name} has been added to your cart!`)
      router.refresh()
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error(error.message || 'Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="relative h-[400px] w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-blue-600">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>
          
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <p className="text-gray-600">{product.details}</p>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  )
}
