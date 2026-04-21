'use client';
import { useState }    from 'react';
import { useQuery }    from '@tanstack/react-query';
import { api }         from '@/lib/api';
import HotelCard       from '@/components/hotel/HotelCard';

const CATEGORIES = ['All', 'budget', 'mid-range', 'luxury'];

export default function HotelsPage() {
  const [filters, setFilters] = useState({
    city:     '',
    minPrice: '',
    maxPrice: '',
    rating:   '',
    category: '',
    sort:     'rating',
    page:     1,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['hotels', filters],
    queryFn:  () => api.get('/hotels', { params: filters }).then(r => r.data),
  });

  const update = (key: string, val: string | number) =>
    setFilters(f => ({ ...f, [key]: val, page: 1 }));

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Hotels</h1>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
        <input
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="City (e.g. Goa)"
          value={filters.city}
          onChange={e => update('city', e.target.value)}
        />
        <input type="number"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Min price ₹"
          value={filters.minPrice}
          onChange={e => update('minPrice', e.target.value)}
        />
        <input type="number"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Max price ₹"
          value={filters.maxPrice}
          onChange={e => update('maxPrice', e.target.value)}
        />
        <select value={filters.category} onChange={e => update('category', e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {CATEGORIES.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
        </select>
        <select value={filters.sort} onChange={e => update('sort', e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="rating">Top rated</option>
          <option value="price_low">Price: low to high</option>
          <option value="price_high">Price: high to low</option>
          <option value="reviews">Most reviewed</option>
        </select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{data?.pagination?.total || 0} hotels found</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.hotels?.map((hotel: any) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>

          {/* Pagination */}
          {data?.pagination?.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(data.pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    filters.page === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
                  }`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
