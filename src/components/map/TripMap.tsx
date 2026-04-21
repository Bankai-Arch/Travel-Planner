'use client';
import { useEffect, useRef } from 'react';

interface Trip {
  title:       string;
  destination: string;
  itinerary:   Array<{
    day:        number;
    theme:      string;
    activities: Array<{ activity: string; location?: { lat: number; lng: number } }>;
  }>;
}

declare global {
  interface Window { google: any; initMap: () => void; }
}

export default function TripMap({ trip }: { trip: Trip }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Collect all activity locations
    const locations = trip.itinerary.flatMap(day =>
      day.activities
        .filter(a => a.location?.lat)
        .map(a => ({ ...a.location!, label: a.activity, day: day.day }))
    );

    const loadMap = () => {
      if (!mapRef.current || !window.google) return;

      // Centre on destination or first available location
      const centre = locations[0] || { lat: 20.5937, lng: 78.9629 };  // India default

      const map = new window.google.maps.Map(mapRef.current, {
        center:    centre,
        zoom:      locations.length > 0 ? 12 : 5,
        mapTypeId: 'roadmap',
        styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
      });

      // Day colour palette
      const colours = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706', '#0891B2'];

      // Drop markers for each activity with a location
      locations.forEach((loc, i) => {
        const marker = new window.google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          map,
          title:    loc.label,
          label: {
            text:      String(i + 1),
            color:     'white',
            fontWeight:'bold',
            fontSize:  '12px',
          },
          icon: {
            path:        window.google.maps.SymbolPath.CIRCLE,
            scale:       16,
            fillColor:   colours[(loc.day - 1) % colours.length],
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
          },
        });

        const info = new window.google.maps.InfoWindow({
          content: `<div style="font-family:sans-serif;padding:4px 2px">
            <div style="font-weight:600;font-size:13px">${loc.label}</div>
            <div style="color:#6b7280;font-size:12px">Day ${loc.day}</div>
          </div>`,
        });

        marker.addListener('click', () => info.open(map, marker));
      });

      // Draw route between consecutive points if we have multiple
      if (locations.length > 1) {
        const poly = new window.google.maps.Polyline({
          path:          locations.map(l => ({ lat: l.lat, lng: l.lng })),
          geodesic:      true,
          strokeColor:   '#2563EB',
          strokeOpacity: 0.5,
          strokeWeight:  2,
        });
        poly.setMap(map);
      }
    };

    // Load Maps API if not already loaded
    if (window.google?.maps) {
      loadMap();
    } else {
      window.initMap = loadMap;
      const script   = document.createElement('script');
      script.src     = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_KEY}&callback=initMap`;
      script.async   = true;
      script.defer   = true;
      document.head.appendChild(script);
    }
  }, [trip]);

  return (
    <div className="space-y-4">
      <div ref={mapRef} className="w-full rounded-2xl border border-gray-100 overflow-hidden" style={{ height: '480px' }} />

      {/* Day Legend */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-3 text-sm">Map Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {trip.itinerary.map((day, i) => {
            const colours = ['#2563EB','#7C3AED','#059669','#DC2626','#D97706','#0891B2'];
            return (
              <div key={day.day} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: colours[i % colours.length] }} />
                <span className="text-xs text-gray-600">Day {day.day}: {day.theme}</span>
              </div>
            );
          })}
        </div>
        {trip.itinerary.every(d => d.activities.every(a => !a.location)) && (
          <p className="text-xs text-gray-400 mt-2">
            Tip: Map pins appear when activities include GPS coordinates from the AI planner.
          </p>
        )}
      </div>
    </div>
  );
}
