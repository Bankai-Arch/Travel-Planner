'use client';
import { useState } from 'react';
import Link         from 'next/link';

interface Activity {
  time:     string;
  activity: string;
  cost:     number;
  tip?:     string;
}

interface DayPlan {
  day:        number;
  theme:      string;
  activities: Activity[];
}

interface Trip {
  _id:                string;
  title:              string;
  destination:        string;
  summary:            string;
  days:               number;
  totalEstimatedCost: number;
  itinerary:          DayPlan[];
  budgetBreakdown:    Record<string, number>;
  packingList:        string[];
  weatherInfo?:       string;
}

export default function ItineraryView({ trip }: { trip: Trip }) {
  const [activeDay, setActiveDay] = useState(1);

  const day = trip.itinerary.find(d => d.day === activeDay);

  const budgetIcons: Record<string, string> = {
    accommodation: '🏨',
    food:          '🍽️',
    transport:     '🚗',
    activities:    '🎯',
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{trip.title}</h2>
            <p className="text-blue-100 text-sm mb-3">{trip.summary}</p>
            <div className="flex gap-4 text-sm">
              <span>📍 {trip.destination}</span>
              <span>📅 {trip.days} days</span>
              <span>💰 ₹{trip.totalEstimatedCost.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <Link href={`/trip/${trip._id}`}
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition">
            Full View →
          </Link>
        </div>
        {trip.weatherInfo && (
          <div className="mt-3 bg-white/10 rounded-lg px-3 py-2 text-sm">
            🌤️ {trip.weatherInfo}
          </div>
        )}
      </div>

      {/* Budget Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">Budget Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(trip.budgetBreakdown).map(([key, val]) => (
            <div key={key} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{budgetIcons[key] || '💸'}</div>
              <div className="text-xs text-gray-500 capitalize">{key}</div>
              <div className="font-bold text-gray-800">₹{val.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Day-wise Itinerary */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Day Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100">
          {trip.itinerary.map(d => (
            <button key={d.day} onClick={() => setActiveDay(d.day)}
              className={`flex-shrink-0 px-5 py-3.5 text-sm font-medium transition border-b-2 ${
                activeDay === d.day
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}>
              Day {d.day}
            </button>
          ))}
        </div>

        {/* Day Content */}
        {day && (
          <div className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">
              Day {day.day}: <span className="text-blue-600">{day.theme}</span>
            </h3>
            <div className="space-y-3">
              {day.activities.map((a, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                  <div className="text-xs text-gray-400 w-14 flex-shrink-0 pt-0.5 font-mono">{a.time}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{a.activity}</div>
                    {a.tip && <div className="text-xs text-blue-600 mt-0.5">💡 {a.tip}</div>}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 flex-shrink-0">
                    {a.cost > 0 ? `₹${a.cost.toLocaleString('en-IN')}` : 'Free'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Packing List */}
      {trip.packingList?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-3">🎒 Packing List</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {trip.packingList.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
