'use client'

export default function ErrorDisplay() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-4">Failed to load products. Please try again later.</p>
      <button
        onClick={() => window.location.reload()}
        className="text-indigo-600 hover:text-indigo-500"
      >
        Try Again
      </button>
    </div>
  )
} 