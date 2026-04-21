import Link from 'next/link';

const destinations = [
  { name: 'Goa',      emoji: '🏖️', desc: 'Beaches & nightlife' },
  { name: 'Manali',   emoji: '🏔️', desc: 'Mountains & snow' },
  { name: 'Kerala',   emoji: '🌴', desc: 'Backwaters & spice' },
  { name: 'Rajasthan',emoji: '🏰', desc: 'Forts & culture' },
  { name: 'Ladakh',   emoji: '🗻', desc: 'High altitude desert' },
  { name: 'Rishikesh',emoji: '🙏', desc: 'Yoga & adventure' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Plan Your Dream Trip<br />
            <span className="text-yellow-300">Powered by AI ✨</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Tell us where you want to go. Our AI generates a personalized day-wise itinerary,
            hotel recommendations, and budget breakdown in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan"
              className="bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg hover:bg-yellow-300 transition">
              Plan My Trip →
            </Link>
            <Link href="/hotels"
              className="bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/30 transition">
              Browse Hotels
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Destinations</h2>
        <p className="text-gray-500 mb-8">Explore top picks across India</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((d) => (
            <Link key={d.name} href={`/plan?destination=${d.name}`}
              className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition hover:-translate-y-1 cursor-pointer border border-gray-100">
              <div className="text-4xl mb-2">{d.emoji}</div>
              <div className="font-semibold text-gray-800">{d.name}</div>
              <div className="text-xs text-gray-500 mt-1">{d.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Everything you need to travel smarter
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🤖', title: 'AI Itinerary Generator', desc: 'Get a detailed day-wise plan with activities, timings, and cost estimates in seconds.' },
              { icon: '🏨', title: 'Hotel Booking',          desc: 'Browse and book verified hotels filtered by price, rating, and location.' },
              { icon: '🗺️', title: 'Interactive Maps',       desc: 'Visualize your trip on a map with route planning and nearby place suggestions.' },
              { icon: '💰', title: 'Budget Optimizer',       desc: 'AI-powered budget breakdown that maximizes your experience within your spend.' },
              { icon: '🌤️', title: 'Weather-Aware Plans',   desc: 'Recommendations adapt to real-time weather conditions at your destination.' },
              { icon: '👥', title: 'Collaborative Planning', desc: 'Invite friends and plan together in real-time, just like a shared doc.' },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to plan your next adventure?</h2>
        <p className="text-indigo-200 mb-8">Join thousands of travellers planning smarter trips with AI.</p>
        <Link href="/auth/register"
          className="bg-white text-indigo-600 font-bold px-10 py-4 rounded-xl text-lg hover:bg-indigo-50 transition">
          Get Started Free
        </Link>
      </section>

    </div>
  );
}
