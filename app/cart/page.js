'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Image from 'next/image'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { isSignedIn } = useAuth()

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }
    fetchCart()
  }, [isSignedIn, router])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()
      if (data.success) {
        // Filter out any items with null product
        const validItems = data.data.items.filter(item => item.product)
        setCart({ ...data.data, items: validItems })
      } else {
        toast.error('Failed to fetch cart')
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      toast.error('Failed to fetch cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (slug, newQuantity) => {
    if (newQuantity < 1) return

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: slug,
          quantity: Number(newQuantity),
        }),
      })

      const data = await response.json()
      if (data.success) {
        const validItems = data.data.items.filter(item => item.product)
        setCart({ ...data.data, items: validItems })
        toast.success('Cart updated')
      } else {
        toast.error(data.error || 'Failed to update cart')
      }
    } catch (error) {
      console.error('Error updating cart:', error)
      toast.error('Failed to update cart')
    }
  }

  const handleQuantityChange = (slug, value) => {
    const newQuantity = parseInt(value)
    if (!isNaN(newQuantity) && newQuantity > 0) {
      updateQuantity(slug, newQuantity)
    }
  }

  const removeItem = async (slug) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: slug }),
      })

      const data = await response.json()
      if (data.success) {
        const validItems = data.data.items.filter(item => item.product)
        setCart({ ...data.data, items: validItems })
        toast.success('Item removed from cart')
      } else {
        toast.error('Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error('Failed to remove item')
    }
  }

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        setCart({ items: [] })
        toast.success('Cart cleared')
      } else {
        toast.error('Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <Button onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  // Calculate total using Prisma relation name: item.product
  const total = cart.items.reduce((sum, item) => {
    if (item.product && typeof item.product.price === 'number') {
      return sum + item.product.price * item.quantity
    }
    return sum
  }, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          {cart.items.map((item) => {
            if (!item.product) return null
            return (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-500">${item.product.price}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.product.slug, e.target.value)}
                    className="w-16 text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                
                <div className="w-24 text-right">
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.product.slug)}
                >
                  Remove
                </Button>
              </div>
            )
          })}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Total</h2>
            <p className="text-2xl font-bold">${total.toFixed(2)}</p>
          </div>
          
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={clearCart}
              className="flex-1"
            >
              Clear Cart
            </Button>
            <Button
              onClick={() => router.push('/checkout')}
              className="flex-1"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}