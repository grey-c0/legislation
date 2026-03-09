import { useState } from 'react';
import type { Entry, Status } from '@/types/legislation';
import { SEVERITY_COLORS, STATUS_COLORS, STATUS_LABELS, CATEGORY_LABELS } from '@/types/legislation';
import { ChevronDown, ExternalLink, AlertTriangle, Shield, FileText, Users } from 'lucide-react';

interface EntryCardProps {
  entry: Entry;
  isExpanded?: boolean;
}

export function EntryCard({ entry, isExpanded: initialExpanded = false }: EntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [showSources, setShowSources] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const severityColor = SEVERITY_COLORS[entry.severity.score];
  
  const getStatusClass = (status: Status) => {
    switch (status) {
      case 'proposed':
        return 'status-proposed';
      case 'passed':
        return 'status-passed';
      case 'implementing':
        return 'status-implementing';
      case 'active':
        return 'status-active';
      case 'challenged':
        return 'status-challenged';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="w-4 h-4" />;
      case 'implementing':
        return <Shield className="w-4 h-4" />;
      case 'challenged':
        return <Users className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="entry-card mb-4">
      {/* Header */}
      <div
        className="p-4 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between gap-4">
          {/* ID and Name */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                [{entry.id}]
              </span>
              <span 
                className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5"
                style={{ 
                  backgroundColor: severityColor,
                  color: entry.severity.score >= 4 ? 'white' : '#1a1a1a'
                }}
              >
                SEVERITY: {entry.severity.score}/5
              </span>
            </div>
            <h3 className="text-lg font-bold leading-tight mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {entry.commonName}
            </h3>
            <p className="text-sm text-muted-foreground font-mono">
              {entry.legalName}
            </p>
          </div>

          {/* Severity Dots + Expand Chevron */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-1 items-center">
              {[1, 2, 3, 4, 5].map(level => (
                <div
                  key={level}
                  className={`severity-dot ${level <= entry.severity.score ? 'active' : 'inactive'}`}
                  style={{
                    color: severityColor,
                    borderColor: severityColor
                  }}
                />
              ))}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-3 flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider ${getStatusClass(entry.status)}`}
            style={{
              color: entry.status === 'proposed' ? '#1a1a1a' : 'white',
              backgroundColor: entry.status === 'proposed' ? 'transparent' : STATUS_COLORS[entry.status]
            }}
          >
            {getStatusIcon(entry.status)}
            <span>{STATUS_LABELS[entry.status]}</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {entry.jurisdiction}
          </span>
        </div>

        {/* Categories */}
        <div className="mt-3 flex flex-wrap gap-2">
          {entry.categories.map(category => (
            <span 
              key={category}
              className={`category-tag ${category === 'worker_surveillance' ? 'tag-worker' : category.includes('union') ? 'tag-union' : ''}`}
            >
              {CATEGORY_LABELS[category]}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border px-4 py-4">
          {/* Description */}
          <div className="mb-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Description
            </h4>
            <p className="text-sm leading-relaxed">
              {entry.description}
            </p>
          </div>

          {/* Severity Rationale */}
          <div className="mb-4 p-3 bg-muted/50">
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Severity Assessment
            </h4>
            <p className="text-xs leading-relaxed font-mono text-muted-foreground">
              {entry.severity.rationale}
            </p>
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-2">
            {/* Sources */}
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSources(!showSources);
                }}
                className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider hover:text-primary transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showSources ? 'rotate-180' : ''}`} />
                <span>Sources [{entry.sources.length}]</span>
              </button>
              
              {showSources && (
                <div className="mt-2 space-y-2 pl-6">
                  {entry.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:text-primary transition-colors group"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3 mt-0.5 opacity-50 group-hover:opacity-100" />
                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground mr-2">
                          [{source.type}]
                        </span>
                        <span>{source.description}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotes(!showNotes);
                }}
                className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider hover:text-primary transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showNotes ? 'rotate-180' : ''}`} />
                <span>Additional Context</span>
              </button>
              
              {showNotes && (
                <div className="mt-2 pl-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {entry.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
