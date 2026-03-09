import type { Entry } from '@/types/legislation';
import { EntryCard } from './EntryCard';
import { X, Filter, AlertTriangle } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Status, Category } from '@/types/legislation';
import { STATUS_LABELS, EU_MEMBER_STATES } from '@/types/legislation';

interface LegislationSidebarProps {
  entries: Entry[];
  selectedCountry: string | null;
  onClose: () => void;
  onClearCountry: () => void;
  isOpen: boolean;
}

export function LegislationSidebar({ entries, selectedCountry, onClose, onClearCountry, isOpen }: LegislationSidebarProps) {
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  const [severityFilter, setSeverityFilter] = useState<number | null>(null);

  // Filter entries
  const filteredEntries = useMemo(() => {
    let filtered = entries;
    
    if (selectedCountry) {
      filtered = filtered.filter(e =>
        e.location === selectedCountry ||
        (e.jurisdiction === 'Union' && EU_MEMBER_STATES.has(selectedCountry))
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(e => e.status === statusFilter);
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(e => e.categories.includes(categoryFilter));
    }
    
    if (severityFilter) {
      filtered = filtered.filter(e => e.severity.score === severityFilter);
    }
    
    // Sort by severity (highest first), then by status
    return filtered.sort((a, b) => {
      if (b.severity.score !== a.severity.score) {
        return b.severity.score - a.severity.score;
      }
      const statusOrder = { active: 0, implementing: 1, passed: 2, proposed: 3, challenged: 4, repealed: 5 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [entries, selectedCountry, statusFilter, categoryFilter, severityFilter]);

  // Get counts
  const activeCount = entries.filter(e => e.status === 'active').length;
  const implementingCount = entries.filter(e => e.status === 'implementing').length;
  const proposedCount = entries.filter(e => e.status === 'proposed').length;
  const extremeCount = entries.filter(e => e.severity.score === 5).length;

  const hasFilters = statusFilter || categoryFilter || severityFilter;

  return (
    <aside
      className={`fixed top-[88px] left-0 bottom-0 w-full md:w-[480px] lg:w-[520px] bg-background border-r border-border transform transition-transform duration-300 z-40 flex flex-col overflow-hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <h2
              className="text-lg font-bold truncate"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {selectedCountry ?? 'All Legislation'}
              <span className="text-muted-foreground font-normal ml-2">
                [{filteredEntries.length}]
              </span>
            </h2>
            {selectedCountry && (
              <button
                onClick={onClearCountry}
                className="text-[10px] font-mono uppercase tracking-wider text-primary hover:underline whitespace-nowrap"
                aria-label="Show all countries"
              >
                ← All
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted transition-colors flex-shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary text-xs font-mono">
            <AlertTriangle className="w-3 h-3" />
            <span>{extremeCount} Extreme</span>
          </div>
          <div className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-mono">
            {activeCount} Active
          </div>
          <div className="px-2 py-1 bg-orange-500/10 text-orange-600 text-xs font-mono">
            {implementingCount} Implementing
          </div>
          <div className="px-2 py-1 bg-pink-500/10 text-pink-600 text-xs font-mono">
            {proposedCount} Proposed
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Filters
            </span>
            {hasFilters && (
              <button
                onClick={() => {
                  setStatusFilter(null);
                  setCategoryFilter(null);
                  setSeverityFilter(null);
                }}
                className="text-xs text-primary hover:underline ml-auto"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {/* Status filters */}
            {(['active', 'implementing', 'passed', 'proposed', 'challenged'] as Status[]).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider border transition-colors ${
                  statusFilter === status 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'hover:border-primary'
                }`}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {/* Severity filters */}
            {[5, 4, 3].map(severity => (
              <button
                key={severity}
                onClick={() => setSeverityFilter(severityFilter === severity ? null : severity)}
                className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider border transition-colors ${
                  severityFilter === severity 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'hover:border-primary'
                }`}
              >
                Severity {severity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="overflow-y-auto flex-1 p-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-mono text-sm">
              No legislation matches your filters.
            </p>
            <button
              onClick={() => {
                setStatusFilter(null);
                setCategoryFilter(null);
                setSeverityFilter(null);
              }}
              className="mt-2 text-primary text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <EntryCard 
              key={entry.id} 
              entry={entry}
              isExpanded={filteredEntries.length === 1}
            />
          ))
        )}
      </div>
    </aside>
  );
}
