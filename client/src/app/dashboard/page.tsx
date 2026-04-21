'use client';
import { useEffect }  from 'react';
import { useRouter }  from 'next/navigation';
import { useQuery }   from '@tanstack/react-query';
import Link           from 'next/link';
import { api }        from '@/lib/api';
import { useAuth }    from '@/app/providers';

const statusColors: Record<string, string> = {
  draft:     'bg-gray-100 text-gray-600',
  active:    'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

export default function DashboardPage() {
  const router    = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['my-trips'],
    queryFn:  () => api.get('/trips/my').then(r => r.data),
    enabled:  !!user,
  });

  if (loading || isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-200 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const trips = data?.trips || [];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Trips</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name} 👋</p>
        </div>
        <Link href="/plan"
          className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition flex items-center gap-2">
          ✨ Plan New Trip
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total trips',     value: trips.length,                          icon: '🗺️' },
          { label: 'Active trips',    value: trips.filter((t:any) => t.status === 'active').length,    icon: '✈️' },
          { label: 'Completed',       value: trips.filter((t:any) => t.status === 'completed').length, icon: '✅' },
          { label: 'Draft plans',     value: trips.filter((t:any) => t.status === 'draft').length,     icon: '📝' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Trip List */}
      {trips.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">🌍</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No trips yet</h2>
          <p className="text-gray-500 mb-6">Let AI plan your first adventure</p>
          <Link href="/plan" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            Plan Your First Trip
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip: any) => (
            <Link key={trip._id} href={`/trip/${trip._id}`}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition hover:-translate-y-0.5 block">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-800 flex-1 truncate pr-2">{trip.title}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusColors[trip.status]}`}>
                  {trip.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{trip.summary}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                <span>📍 {trip.destination}</span>
                <span>📅 {trip.days} days</span>
                <span>💰 ₹{trip.totalEstimatedCost?.toLocaleString('en-IN')}</span>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                {new Date(trip.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
