"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';
import { fetchProducts } from '@/lib/api';

const SearchClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const all = await fetchProducts();
      if (!q) {
        setProducts([]);
      } else {
        const term = q.toLowerCase();
        const filtered = (all || []).filter((p: any) => {
          return (
            (p.name || '').toLowerCase().includes(term) ||
            (p.brand || '').toLowerCase().includes(term) ||
            (p.categoryType || '').toLowerCase().includes(term)
          );
        });
        setProducts(filtered);
      }
      setLoading(false);
    };
    load();
  }, [q]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black">Search Results</h1>
          <p className="text-zinc-500 text-sm mt-2">Showing results for <strong className="uppercase">{q}</strong></p>
        </div>

        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-zinc-100 border-t-black rounded-full animate-spin" />
          </div>
        ) : (
          <div>
            {products.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-zinc-500">No results found for <strong>{q}</strong></p>
                <button onClick={() => router.push('/')} className="mt-6 bg-black text-white px-6 py-3 rounded-md font-black">Back to shop</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg"
                  >
                    <div className="bg-zinc-50 p-3 sm:p-4">
                      <img
                        src={(p.imageUrl || '').split('|')[0] || 'https://via.placeholder.com/400'}
                        alt={p.name}
                        className="w-full aspect-[4/3] sm:aspect-square object-contain rounded-lg bg-white"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="font-black text-base sm:text-lg uppercase leading-snug">{p.name}</h3>
                      <p className="text-zinc-500 mt-2 text-sm sm:text-base">Rs. {p.price?.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchClient;