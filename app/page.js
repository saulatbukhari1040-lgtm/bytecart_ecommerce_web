import Link from 'next/link'
import Image from 'next/image'
import {ShieldCheckIcon, TruckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import HeroSlideshow from '@/components/HeroSlideshow'

const featuredProducts = [
  {
    id: 1,
    name: 'MacBook Air',
    description: 'Lightweight, powerful, and portable.',
    price: 999,
    image: '/MacBook Air.png',
  },
  {
    id: 2,
    name: 'MacBook Pro',
    description: 'Ultimate performance for professionals.',
    price: 1999,
    image: '/MacBook Pro.png',
  },
  {
    id: 3,
    name: 'iMac',
    description: 'All-in-one desktop for work and play.',
    price: 1799,
    image: '/iMac.png',
  },
  {
    id: 4,
    name: 'Mac Studio',
    description: 'Supercharged for pros.',
    price: 1999,
    image: '/Mac Studio.png',
  },
]

const categories = [
  {
    id: 1,
    name: 'iPhone',
    description: 'Latest iPhones with advanced features',
    image: '/iphone 16.png',
    href: '/products?category=iphone',
  },
  {
    id: 2,
    name: 'Apple Watch',
    description: 'Smartwatches for every lifestyle',
    image: '/Apple Watch Ultra 2.png',
    href: '/products?category=watch',
  },
  {
    id: 3,
    name: 'Audio & Accessories',
    description: 'AirPods, Apple Pencil, and more',
    image: '/AirPods 4 with Anc.png',
    href: '/products?category=accessories',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Slideshow */}
      <HeroSlideshow />

      {/* Featured Products Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${encodeURIComponent(product.name.replace(/\s+/g, '-').toLowerCase())}`}
                className="group"
              >
                <div className="relative flex items-center justify-center bg-gray-100 rounded-2xl mb-3 sm:mb-4" style={{height:'180px'}}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="object-contain max-h-40 w-auto h-auto"
                  />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-2 sm:mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg sm:text-xl font-bold text-gray-900">${product.price}</span>
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-900 text-white rounded-lg text-xs sm:text-base">View Details</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 bg-[#f5e7de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12">
            <div className="text-center bg-white/70 rounded-2xl shadow-md p-6 sm:p-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <TruckIcon className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-gray-800">Free Shipping</h3>
              <p className="text-gray-600 text-sm sm:text-base">On all orders over $50</p>
            </div>
            <div className="text-center bg-white/70 rounded-2xl shadow-md p-6 sm:p-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ShieldCheckIcon className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-gray-800">Secure Payment</h3>
              <p className="text-gray-600 text-sm sm:text-base">100% secure payment</p>
            </div>
            <div className="text-center bg-white/70 rounded-2xl shadow-md p-6 sm:p-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CurrencyDollarIcon className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-gray-800">Money Back</h3>
              <p className="text-gray-600 text-sm sm:text-base">30 days guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Stay Updated</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest products and exclusive offers.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
