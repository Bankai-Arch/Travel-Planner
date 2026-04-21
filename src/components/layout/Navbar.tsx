'use client';
import Link         from 'next/link';
import { useAuth }  from '@/app/providers';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-800">
          <span className="text-2xl">✈️</span>
          <span>TravelAI</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/plan"         className="hover:text-blue-600 transition">Plan Trip</Link>
          <Link href="/hotels"       className="hover:text-blue-600 transition">Hotels</Link>
          <Link href="/trips/public" className="hover:text-blue-600 transition">Explore</Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-sm text-purple-600 font-medium hover:underline">
                  Admin
                </Link>
              )}
              <Link href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout}
                className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                Sign in
              </Link>
              <Link href="/auth/register"
                className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Get started
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
