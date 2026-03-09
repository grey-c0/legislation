import { Eye, EyeOff, Menu, X, Radio, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ isDarkMode, onToggleDarkMode, onToggleSidebar, isSidebarOpen }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-muted transition-colors"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <div>
              <h1 
                className="text-lg md:text-xl font-bold tracking-tight leading-none"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                SURVEILLANCE
                <span className="text-primary"> TRACKER</span>
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider hidden sm:block">
                Tactical Cartography of Digital Authoritarianism
              </p>
            </div>
          </div>
        </div>

        {/* Right: Stats + Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Live indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <Radio className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-muted-foreground uppercase tracking-wider">Live</span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 hover:bg-muted transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Warning banner */}
      <div className="bg-primary text-primary-foreground text-center py-1 px-4">
        <p className="text-[10px] font-mono uppercase tracking-wider">
          <span className="font-bold">WARNING:</span> This site documents active surveillance legislation. 
          <span className="hidden sm:inline"> No tracking, no cookies, no analytics.</span>
        </p>
      </div>
    </header>
  );
}
