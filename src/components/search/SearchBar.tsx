// src/components/search/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  author: {
    name: string;
  };
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchPosts = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.posts || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchPosts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleResultClick = (slug: string) => {
    setShowResults(false);
    setQuery('');
    router.push(`/posts/${slug}`);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xs">
      <div className="relative">
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="w-full px-3 py-2 pl-9 pr-4 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto z-50">
          {results.map((post) => (
            <div
              key={post.id}
              onClick={() => handleResultClick(post.slug)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <h4 className="font-medium text-gray-900 text-sm">{post.title}</h4>
              {post.excerpt && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-1">{post.excerpt}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">By {post.author.name}</p>
            </div>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 p-3 z-50">
          <p className="text-gray-500 text-sm text-center">No posts found for "{query}"</p>
        </div>
      )}
    </div>
  );
}