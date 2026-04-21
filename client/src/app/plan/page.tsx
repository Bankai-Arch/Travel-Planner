'use client';
import { useState, Suspense } from 'react';
import { useSearchParams }     from 'next/navigation';
import { api }                 from '@/lib/api';
import ItineraryView           from '@/components/trip/ItineraryView';

const INTERESTS = ['Adventure', 'Culture', 'Food', 'Nature', 'Beach', 'History', 'Shopping', 'Nightlife', 'Spiritual', 'Photography'];
const STYLES    = ['Budget', 'Balanced', 'Comfort', 'Luxury'];

function PlanPageContent() {
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    destination:  searchParams.get('destination') || '',
    days:         3,
    budget:       15000,
    interests:    [] as string[],
    travelStyle:  'Balanced',
  });

  const [trip,    setTrip]    = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const toggleInterest = (i: string) =>
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i],
    }));

  const handlePlan = async () => {
    if (!form.destination.trim()) { setError('Please enter a destination'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/plan-trip', form);
      setTrip(data.trip);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Plan Your Trip ✨</h1>
      <p className="text-gray-500 mb-8">Fill in the details and our AI will build your perfect itinerary</p>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Goa, Manali, Kerala..."
              value={form.destination}
              onChange={e => setForm({ ...form, destination: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of days</label>
            <input type="number" min={1} max={30}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.days}
              onChange={e => setForm({ ...form, days: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total budget (₹)
              <span className="text-gray-400 font-normal ml-1">per person</span>
            </label>
            <input type="number" step={1000} min={1000}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.budget}
              onChange={e => setForm({ ...form, budget: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Interests */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => (
              <button key={i} onClick={() => toggleInterest(i)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                  form.interests.includes(i)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                }`}>
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Travel style</label>
          <div className="flex gap-2">
            {STYLES.map(s => (
              <button key={s} onClick={() => setForm({ ...form, travelStyle: s })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                  form.travelStyle === s
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <button onClick={handlePlan} disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Generating your itinerary...
            </>
          ) : (
            '✨ Generate AI Itinerary'
          )}
        </button>
      </div>

      {/* Result */}
      {trip && <ItineraryView trip={trip} />}
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto py-10 px-4">Loading...</div>}>
      <PlanPageContent />
    </Suspense>
  );
}
