'use client';
import { useEffect }  from 'react';
import { useRouter }  from 'next/navigation';
import { useQuery }   from '@tanstack/react-query';
import { api }        from '@/lib/api';
import { useAuth }    from '@/app/providers';

export default function AdminPage() {
  const router          = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn:  () => api.get('/admin/stats').then(r => r.data),
    enabled:  user?.role === 'admin',
  });

  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn:  () => api.get('/admin/users').then(r => r.data),
    enabled:  user?.role === 'admin',
  });

  if (loading) return null;

  const stats = data?.stats || {};

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total users',       value: stats.totalUsers,      icon: '👥', color: 'bg-blue-50 text-blue-700' },
          { label: 'Trips planned',     value: stats.totalTrips,      icon: '🗺️', color: 'bg-purple-50 text-purple-700' },
          { label: 'Hotels listed',     value: stats.totalHotels,     icon: '🏨', color: 'bg-green-50 text-green-700' },
          { label: 'Bookings this month',value: stats.monthlyBookings, icon: '📅', color: 'bg-amber-50 text-amber-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-3xl font-bold mb-0.5">{s.value ?? '—'}</div>
            <div className="text-sm opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Top Destinations */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Top Destinations</h2>
          <div className="space-y-3">
            {(data?.topDestinations || []).map((d: any, i: number) => (
              <div key={d.destination} className="flex items-center gap-3">
                <span className="text-gray-400 text-sm w-5">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{d.destination}</span>
                    <span className="text-xs text-gray-400">{d.count} trips</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(d.count / (data.topDestinations[0]?.count || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Recent Users</h2>
          <div className="space-y-3">
            {(usersData?.users || []).slice(0, 8).map((u: any) => (
              <div key={u._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {u.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">{u.name}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
