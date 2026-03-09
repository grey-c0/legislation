import { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Entry } from '@/types/legislation';
import { COUNTRY_COORDINATES, STATUS_COLORS, STATUS_LABELS } from '@/types/legislation';

interface SurveillanceMapProps {
  entries: Entry[];
  selectedCountry: string | null;
  onCountrySelect: (country: string) => void;
}

export function SurveillanceMap({ entries, selectedCountry, onCountrySelect }: SurveillanceMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Calculate average severity for each country
  const getCountrySeverity = useCallback((country: string) => {
    const countryEntries = entries.filter(e => e.location === country);
    if (countryEntries.length === 0) return 0;
    const totalSeverity = countryEntries.reduce((sum, e) => sum + e.severity.score, 0);
    return Math.round(totalSeverity / countryEntries.length);
  }, [entries]);

  // Get most severe status for country
  const getCountryStatus = useCallback((country: string): keyof typeof STATUS_COLORS => {
    const countryEntries = entries.filter(e => e.location === country);
    const statusPriority: Record<string, number> = {
      'active': 5,
      'implementing': 4,
      'passed': 3,
      'proposed': 2,
      'challenged': 1,
      'repealed': 0
    };
    return countryEntries.reduce((mostSevere, entry) => {
      return statusPriority[entry.status] > statusPriority[mostSevere] ? entry.status : mostSevere;
    }, 'repealed' as keyof typeof STATUS_COLORS);
  }, [entries]);

  // Get entry count for country
  const getEntryCount = useCallback((country: string) => {
    return entries.filter(e => e.location === country).length;
  }, [entries]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with CartoDB dark matter tiles for that surveillance aesthetic
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: [10, 30],
      zoom: 1.5,
      pitch: 0,
      bearing: 0,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: false
      }),
      'top-right'
    );

    // Add attribution
    map.current.addControl(
      new maplibregl.AttributionControl({
        compact: true
      }),
      'bottom-right'
    );

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when entries change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each country
    Object.entries(COUNTRY_COORDINATES).forEach(([country, coords]) => {
      const severity = getCountrySeverity(country);
      const status = getCountryStatus(country);
      const entryCount = getEntryCount(country);

      if (entryCount === 0) return;

      const color = STATUS_COLORS[status];
      const isSelected = selectedCountry === country;

      // Create marker element
      const el = document.createElement('div');
      el.className = `map-marker relative`;
      el.innerHTML = `
        <div style="
          width: ${Math.max(24, severity * 8)}px;
          height: ${Math.max(24, severity * 8)}px;
          background-color: ${color};
          border-radius: 50%;
          border: ${isSelected ? '4px' : '2px'} solid white;
          box-shadow: 0 0 ${severity * 4}px ${color}, 0 0 ${severity * 8}px ${color}80;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          <span style="
            color: white;
            font-size: ${Math.max(10, severity * 2)}px;
            font-weight: bold;
            font-family: 'Space Grotesk', sans-serif;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          ">${entryCount}</span>
        </div>
        ${isSelected ? `
          <div style="
            position: absolute;
            bottom: -24px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 2px 8px;
            font-size: 11px;
            font-family: 'IBM Plex Mono', monospace;
          ">${country}</div>
        ` : ''}
      `;

      // Add click handler
      el.addEventListener('click', () => {
        onCountrySelect(country);
        
        // Fly to country
        if (map.current) {
          map.current.flyTo({
            center: coords,
            zoom: 4,
            duration: 1500,
            essential: true
          });
        }
      });

      // Create and add marker
      if (map.current) {
        const marker = new maplibregl.Marker({
          element: el,
          anchor: 'center'
        })
          .setLngLat(coords)
          .addTo(map.current);

        markersRef.current.push(marker);
      }
    });
  }, [entries, selectedCountry, onCountrySelect, getCountrySeverity, getCountryStatus, getEntryCount]);

  // Fly to selected country
  useEffect(() => {
    if (!map.current || !selectedCountry) return;
    
    const coords = COUNTRY_COORDINATES[selectedCountry];
    if (coords) {
      map.current.flyTo({
        center: coords,
        zoom: 4,
        duration: 1500,
        essential: true
      });
    }
  }, [selectedCountry]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm p-3 text-white text-xs font-mono">
        <div className="mb-2 font-bold uppercase tracking-wider">Status</div>
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div key={status} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }}
            />
            <span className={status === 'challenged' ? 'animate-pulse' : ''}>{label}</span>
          </div>
        ))}
      </div>

      {/* Severity indicator */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm p-3 text-white text-xs font-mono">
        <div className="mb-2 font-bold uppercase tracking-wider">Severity</div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(level => (
            <div 
              key={level}
              className="w-4 h-4 rounded-full border border-white/30"
              style={{ 
                backgroundColor: level <= 2 ? '#FFB6C1' : level === 3 ? '#DC143C' : '#8B0000',
                opacity: level / 5
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-white/60">
          <span>Low</span>
          <span>Extreme</span>
        </div>
      </div>
    </div>
  );
}
