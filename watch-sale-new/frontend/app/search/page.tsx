import { Suspense } from 'react';
import SearchClient from './search-client';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SearchClient />
    </Suspense>
  );
}
