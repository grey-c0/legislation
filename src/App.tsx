import { useState, useEffect, useCallback } from 'react';
import { SurveillanceMap } from '@/components/SurveillanceMap';
import { Header } from '@/components/Header';
import { LegislationSidebar } from '@/components/LegislationSidebar';
import type { Entry, LegislationData } from '@/types/legislation';
import { AlertTriangle, Globe, Shield, Radio } from 'lucide-react';

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load legislation data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/legislation.json');
        if (!response.ok) {
          throw new Error('Failed to load legislation data');
        }
        const data: LegislationData = await response.json();
        setEntries(data.entries);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Handle country selection
  const handleCountrySelect = useCallback((country: string) => {
    setSelectedCountry(country);
    setIsSidebarOpen(true);
  }, []);

  // Calculate statistics
  const stats = {
    total: entries.length,
    active: entries.filter(e => e.status === 'active').length,
    implementing: entries.filter(e => e.status === 'implementing').length,
    proposed: entries.filter(e => e.status === 'proposed').length,
    extreme: entries.filter(e => e.severity.score === 5).length,
    countries: new Set(entries.map(e => e.location)).size
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center paper-texture">
        <div className="text-center">
          <Radio className="w-8 h-8 animate-pulse mx-auto mb-4 text-primary" />
          <p className="font-mono text-sm text-muted-foreground">Loading surveillance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center paper-texture">
        <div className="text-center max-w-md p-6 border border-destructive">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <h2 className="text-lg font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Data Load Failed
          </h2>
          <p className="font-mono text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen paper-texture ${isDarkMode ? 'dark' : ''}`}>
      <Header 
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Content */}
      <main className="pt-[88px] h-screen">
        {/* Map Container */}
        <div 
          className={`h-full transition-all duration-300 ${
            isSidebarOpen ? 'md:ml-[480px] lg:ml-[520px]' : ''
          }`}
        >
          <SurveillanceMap 
            entries={entries}
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
          />
        </div>

        {/* Sidebar */}
        <LegislationSidebar
          entries={entries}
          selectedCountry={selectedCountry}
          onClose={toggleSidebar}
          isOpen={isSidebarOpen}
        />

        {/* Stats Overlay (when sidebar closed) */}
        {!isSidebarOpen && (
          <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm p-4 text-white">
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span>{stats.countries} Countries</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-destructive" />
                <span>{stats.active} Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-orange-500" />
                <span>{stats.implementing} Implementing</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <span>{stats.extreme} Extreme</span>
              </div>
            </div>
          </div>
        )}

        {/* Country selector (mobile/desktop when no selection) */}
        {!selectedCountry && (
          <div className="fixed bottom-4 left-4 right-4 md:right-auto md:w-auto bg-black/80 backdrop-blur-sm p-3 text-white">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/60 mb-2">
              Select a country
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(entries.map(e => e.location))).map(country => {
                const countryEntries = entries.filter(e => e.location === country);
                return (
                  <button
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    className="px-3 py-1.5 text-xs font-mono border border-white/30 hover:border-primary hover:bg-primary/20 transition-colors"
                  >
                    {country}
                    <span className="ml-2 text-white/50">[{countryEntries.length}]</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 px-4 text-[10px] font-mono text-muted-foreground z-30 hidden md:block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>ZERO TRACKING</span>
            <span>NO COOKIES</span>
            <span>NO ANALYTICS</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Data last updated: 2025-03-09</span>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
