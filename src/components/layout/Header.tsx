// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import SearchBar from '../search/SearchBar';

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold font-serif text-green-800 hover:text-green-800 transition-colors">
              Ikaze
            </span>
          </Link>
          <SearchBar />

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-black hover:text-green-700 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-black hover:text-green-700 font-medium transition-colors"
            >
              About
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/editor" 
                  className="bg-green-600 text-black px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  Write
                </Link>
                <Link 
                  href="/profile" 
                  className="text-black hover:text-green-700 font-medium transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-black hover:text-gray-700 transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="bg-green-600 text-black px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
        
        
        <div className="pb-4">
          <div className="max-w-md">
            
          </div>
        </div>
      </div>
    </header>
  );
}