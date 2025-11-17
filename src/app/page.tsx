import React from 'react'

export default function Home() {
  return (
    <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <section className='text-center'>
         <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to <span className="text-green-800">Ikaze</span>

         </h1>
         <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Discover and share stories about the vibrant culture, food, travel, and daily life in Rwanda.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <a
              href="/signup"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
