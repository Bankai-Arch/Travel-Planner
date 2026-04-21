'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState }             from 'react';
import { api }                  from '@/lib/api';
import ItineraryView            from '@/components/trip/ItineraryView';
import TripMap                  from '@/components/map/TripMap';

export default function TripDetailPage() {
  const { id }         = useParams<{ id: string }>();
  const router         = useRouter();
  const queryClient    = useQueryClient();
  const [tab, setTab]  = useState<'itinerary' | 'map' | 'expenses'>('itinerary');

  const { data, isLoading, error } = useQuery({
    queryKey: ['trip', id],
    queryFn:  () => api.get(`/trips/${id}`).then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/trips/${id}`),
    onSuccess:  () => { queryClient.invalidateQueries({ queryKey: ['my-trips'] }); router.push('/dashboard'); },
  });

  const togglePublic = useMutation({
    mutationFn: () => api.put(`/trips/${id}`, { isPublic: !data?.trip?.isPublic }),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['trip', id] }),
  });

  if (isLoading) return <div className="max-w-5xl mx-auto py-10 px-4 text-gray-500">Loading trip...</div>;
  if (error || !data?.trip) return <div className="max-w-5xl mx-auto py-10 px-4 text-red-500">Trip not found</div>;

  const trip = data.trip;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1">
          ← Back
        </button>
        <div className="flex gap-2">
          <button onClick={() => togglePublic.mutate()}
            className={`text-sm font-medium px-4 py-2 rounded-lg border transition ${
              trip.isPublic ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
            {trip.isPublic ? '🌐 Public' : '🔒 Private'}
          </button>
          <button onClick={() => deleteMutation.mutate()}
            className="text-sm font-medium px-4 py-2 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition">
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-1">
        {(['itinerary', 'map', 'expenses'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition ${
              tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}>
            {t === 'itinerary' ? '📅 Itinerary' : t === 'map' ? '🗺️ Map' : '💰 Expenses'}
          </button>
        ))}
      </div>

      {tab === 'itinerary' && <ItineraryView trip={trip} />}
      {tab === 'map'       && <TripMap trip={trip} />}
      {tab === 'expenses'  && <ExpenseTracker tripId={id} />}
    </div>
  );
}

// ─── Inline Expense Tracker ───────────────────────────────────────────────────
function ExpenseTracker({ tripId }: { tripId: string }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ category: 'food', amount: '', note: '' });

  const { data } = useQuery({
    queryKey: ['expenses', tripId],
    queryFn:  () => api.get('/expenses', { params: { tripId } }).then(r => r.data),
  });

  const addExpense = useMutation({
    mutationFn: () => api.post('/expenses', { ...form, tripId, amount: Number(form.amount) }),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', tripId] });
      setForm({ category: 'food', amount: '', note: '' });
    },
  });

  const expenses  = data?.expenses || [];
  const total     = expenses.reduce((s: number, e: any) => s + e.amount, 0);
  const CATS      = ['food', 'transport', 'hotel', 'activity', 'shopping', 'other'];
  const CAT_ICONS: Record<string, string> = { food: '🍽️', transport: '🚗', hotel: '🏨', activity: '🎯', shopping: '🛍️', other: '💸' };

  return (
    <div className="space-y-5">
      {/* Add Expense */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">Add Expense</h3>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {CATS.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
          </select>
          <input type="number" placeholder="Amount (₹)"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
          />
          <input placeholder="Note (optional)"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
          />
        </div>
        <button onClick={() => addExpense.mutate()} disabled={!form.amount}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
          Add Expense
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Total Spent</h3>
          <span className="text-2xl font-bold text-blue-600">₹{total.toLocaleString('en-IN')}</span>
        </div>
        <div className="space-y-2">
          {expenses.map((e: any) => (
            <div key={e._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <span>{CAT_ICONS[e.category]}</span>
                <div>
                  <div className="text-sm font-medium text-gray-700 capitalize">{e.category}</div>
                  {e.note && <div className="text-xs text-gray-400">{e.note}</div>}
                </div>
              </div>
              <span className="font-semibold text-gray-800">₹{e.amount.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
