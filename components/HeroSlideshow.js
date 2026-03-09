'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const slides = [
  {
    id: 1,
    title: "MacBook Pro",
    description: "Ultimate performance for professionals. Power your creativity with the new MacBook Pro.",
    image: "/MacBook Pro.png",
    cta: "Shop MacBook Pro",
    link: "/products?category=macbook",
  },
  {
    id: 2,
    title: "iPhone 16 Pro",
    description: "Pro camera system and display. Experience the next generation of iPhone.",
    image: "/iPhone 16 Pro.png",
    cta: "Shop iPhone 16 Pro",
    link: "/products?category=iphone",
  },
  {
    id: 3,
    title: "Apple Watch Ultra 2",
    description: "Rugged and capable for adventure. The most advanced Apple Watch yet.",
    image: "/Apple Watch Ultra 2.png",
    cta: "Shop Watch Ultra 2",
    link: "/products?category=watch",
  },
]

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[currentSlide]
  const slug = slide.title.replace(/\s+/g, '-').toLowerCase()

  return (
    <section className="relative h-auto min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-200 via-rose-200 to-indigo-200 py-8 md:py-0">
      {/* Decorative SVG background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="1200" cy="100" r="300" fill="#f9e8e1" fillOpacity="0.7" />
          <circle cx="200" cy="500" r="200" fill="#e0c3fc" fillOpacity="0.5" />
          <rect x="600" y="200" width="400" height="400" rx="200" fill="#a5b4fc" fillOpacity="0.25" />
        </svg>
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-12 gap-8 md:gap-0">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left md:pr-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 tracking-tight text-gray-900 drop-shadow-lg animate-fade-in">
            {slide.title}
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-gray-700 mb-6 sm:mb-8 animate-fade-in">
            {slide.description}
          </p>
          <Link
            href={`/products/${slug}`}
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 group animate-fade-in text-base sm:text-lg"
          >
            {slide.cta}
            <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        {/* Image Card */}
        <div className="flex-1 flex justify-center md:justify-end w-full animate-fade-in mt-6 md:mt-0">
          <div className="bg-white/80 shadow-xl rounded-3xl p-4 sm:p-6 md:p-10 flex items-center justify-center max-w-xs md:max-w-md mx-auto md:mx-0">
            <Image
              src={slide.image}
              alt={slide.title}
              width={220}
              height={220}
              className="object-contain w-full h-full drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-indigo-600 scale-125' : 'bg-indigo-300'
            }`}
          />
        ))}
      </div>
    </section>
  )
} 