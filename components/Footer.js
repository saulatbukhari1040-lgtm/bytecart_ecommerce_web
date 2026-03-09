import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#f5e7de]">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-gray-800">ByteCart</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Your one-stop destination for premium electronics and tech accessories.
            </p>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-gray-800">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link href="/products" className="text-gray-700 hover:text-indigo-600 transition-colors text-sm sm:text-base">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition-colors text-sm sm:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors text-sm sm:text-base">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-gray-800">Contact Info</h3>
            <ul className="space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
              <li>123 Tech Avenue, Karachi, Pakistan</li>
              <li>Phone: +92 300 1234567</li>
              <li>Email: support@bytecart.pk</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} ByteCart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 