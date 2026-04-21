import Link from 'next/link';

interface Hotel {
  _id:           string;
  name:          string;
  city:          string;
  state:         string;
  pricePerNight: number;
  rating:        number;
  reviewCount:   number;
  category:      string;
  amenities:     string[];
  images:        string[];
}

const categoryColors: Record<string, string> = {
  budget:     'bg-green-100 text-green-700',
  'mid-range':'bg-blue-100 text-blue-700',
  luxury:     'bg-purple-100 text-purple-700',
};

const stars = (rating: number) => '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Link href={`/hotels/${hotel._id}`}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition hover:-translate-y-0.5 block">

      {/* Image */}
      <div className="h-44 bg-gradient-to-br from-blue-100 to-indigo-200 relative overflow-hidden">
        {hotel.images?.[0] ? (
          <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl">🏨</div>
        )}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[hotel.category]}`}>
          {hotel.category}
        </span>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-0.5 truncate">{hotel.name}</h3>
        <p className="text-sm text-gray-500 mb-2">📍 {hotel.city}, {hotel.state}</p>

        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400 text-sm">{stars(hotel.rating)}</span>
          <span className="text-sm text-gray-600 font-medium">{hotel.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({hotel.reviewCount} reviews)</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {hotel.amenities.slice(0, 3).map(a => (
            <span key={a} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100">
              {a}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="text-xs text-gray-400">+{hotel.amenities.length - 3} more</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-800">₹{hotel.pricePerNight.toLocaleString('en-IN')}</span>
            <span className="text-xs text-gray-400">/night</span>
          </div>
          <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-700 transition">
            Book
          </button>
        </div>
      </div>
    </Link>
  );
}
