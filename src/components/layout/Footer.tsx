import React from 'react'

export default function Footer() {
  return (
    <div>
      <footer className="bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Ikaze - Rwanda Lifestyle. All rights reserved.
        </p>
      </div>
    </footer>
    </div>
  )
}
