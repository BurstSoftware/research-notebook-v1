import React, { useState } from 'react';
import { ResearchFinding } from '../types';
import { 
  Calendar, CheckCircle, Clock, Trash2, 
  Edit, ArrowUpRight, Award, HelpCircle, 
  Printer, Download, Shield, Info, Tag, 
  ExternalLink, Quote, BookOpen
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface FindingsExplorerProps {
  findings: ResearchFinding[];
  selectedFinding: ResearchFinding | null;
  onSelectFinding: (finding: ResearchFinding) => void;
  onEditFinding: (finding: ResearchFinding) => void;
  onDeleteFinding: (id: string) => void;
  onExportSingle: (finding: ResearchFinding) => void;
}

export default function FindingsExplorer({
  findings,
  selectedFinding,
  onSelectFinding,
  onEditFinding,
  onDeleteFinding,
  onExportSingle
}: FindingsExplorerProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const statusIcons = {
    Completed: <CheckCircle size={12} className="text-emerald-500" />,
    'In Review': <Clock size={12} className="text-amber-500" />,
    Draft: <Shield size={12} className="text-slate-400" />
  };

  const statusTags = {
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'In Review': 'bg-amber-50 text-amber-700 border-amber-200',
    Draft: 'bg-slate-50 text-slate-600 border-slate-200'
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
      
      {/* 📋 Left Column: List of matching documents */}
      <div id="findings-listing-panel" className="lg:col-span-5 flex flex-col gap-3 max-h-[700px] overflow-y-auto pr-1">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Matching Logs ({findings.length})
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            st.selectbox() list
          </span>
        </div>

        {findings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 italic font-medium">
            No research logs match the current sidebar query constraints. Try widening your criteria parameters.
          </div>
        ) : (
          findings.map((f) => {
            const isActive = selectedFinding?.id === f.id;
            return (
              <div
                id={`finding-card-item-${f.id}`}
                key={f.id}
                onClick={() => onSelectFinding(f)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left flex flex-col gap-2.5 bg-white relative overflow-hidden group ${isActive ? 'border-indigo-600 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-350 shadow-xs'}`}
              >
                {/* Visual Accent bar at left edge for active card */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                )}

                {/* Card Top: Category and Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase">
                    {f.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-150 rounded px-2 py-0.5">
                    {statusIcons[f.status]}
                    <span>{f.status}</span>
                  </div>
                </div>

                {/* Card title and quick summary */}
                <div className="flex flex-col gap-1">
                  <h4 className="font-sans font-bold text-[13.5px] leading-snug text-slate-800 line-clamp-2 uppercase group-hover:text-indigo-600 transition-colors">
                    {f.title}
                  </h4>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                    {f.summary}
                  </p>
                </div>

                {/* Score Indicators bottom line */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-mono select-none">
                  <span className="text-slate-450">
                    Conf: <strong className="text-slate-700">{f.confidence}%</strong>
                  </span>
                  <span className="text-slate-450">
                    Weight: <strong className="text-slate-700">{f.importance}/10</strong>
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                    <Calendar size={10} />
                    {new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 📄 Right Column: Detailed Document Inspector */}
      <div id="finding-focused-inspector" className="lg:col-span-7">
        {selectedFinding ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-6 shadow-xs min-h-[500px]">
            
            {/* Inspector Top Bar Metadata */}
            <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-3">
                <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-150 uppercase">
                  {selectedFinding.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-inspector-edit"
                    onClick={() => onEditFinding(selectedFinding)}
                    className="text-xs bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 rounded font-semibold py-1.5 px-3 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit size={12} />
                    <span>Edit Log</span>
                  </button>

                  <button
                    id="btn-inspector-trash"
                    onClick={() => setShowDeleteConfirm(selectedFinding.id)}
                    className="text-xs bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 rounded font-semibold py-1.5 px-3 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-800 leading-tight tracking-tight uppercase">
                {selectedFinding.title}
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mt-2 text-slate-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-405" />
                  <strong>Published:</strong> {formatDate(selectedFinding.createdAt)}
                </span>
                <span className="hidden sm:inline text-slate-300">|</span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.2 rounded border text-[11px] font-semibold w-fit ${statusTags[selectedFinding.status]}`}>
                  {statusIcons[selectedFinding.status]}
                  <span>{selectedFinding.status}</span>
                </span>
              </div>
            </div>

            {/* Custom Multi Column Metrics (st.columns & st.metric simulator) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-150 p-4 rounded-xl">
              
              <div className="flex flex-col border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  st.metric("Conf. Rating")
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-slate-800 font-display">
                    {selectedFinding.confidence}%
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1 py-0.2 border border-emerald-100 rounded">
                    + {selectedFinding.confidence > 75 ? 'HIGH' : 'MID'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${selectedFinding.confidence > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${selectedFinding.confidence}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  st.metric("Scientific Value")
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-slate-800 font-display">
                    {selectedFinding.importance}/10
                  </span>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-1 py-0.2 border border-indigo-100 rounded">
                    {selectedFinding.importance >= 8 ? 'CRITICAL' : 'RELEVANT'}
                  </span>
                </div>
                {/* Spark lines mock or indicators */}
                <div className="flex gap-1.5 mt-2.5 select-none">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2.5 w-1.5 rounded-xs ${i < selectedFinding.importance ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  st.metric("Review Cycle")
                </span>
                <div className="flex flex-col mt-1.5 justify-center">
                  <span className="font-semibold text-xs text-slate-700">
                    {selectedFinding.status === 'Completed' ? 'System locked (verified)' : 'Active Peer Queries open'}
                  </span>
                  <p className="text-[10px] text-slate-400 font-light mt-1">
                    Compiled successfully with python backend logs
                  </p>
                </div>
              </div>

            </div>

            {/* Synopsis Box */}
            <div className="p-3.5 bg-yellow-50/50 border border-amber-100 rounded-lg text-xs leading-relaxed text-slate-700 flex gap-2.5">
              <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <strong className="text-slate-800 font-semibold uppercase font-display text-[10px] tracking-wider">
                  Summary Abstract
                </strong>
                <p className="italic">"{selectedFinding.summary}"</p>
              </div>
            </div>

            {/* Document contents (Rendered using scientific Markdown) */}
            <div className="text-left py-2 border-t border-b border-slate-100">
              <MarkdownRenderer content={selectedFinding.findings} />
            </div>

            {/* Keyword tags */}
            {selectedFinding.tags.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                  Keywords / Indexes
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedFinding.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10.5px] font-semibold text-slate-600 bg-slate-100 border border-slate-150 rounded px-2.5 py-0.5 flex items-center gap-1 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer"
                    >
                      <Tag size={10} className="text-slate-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sources list */}
            {selectedFinding.sources.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 mt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <BookOpen size={13} className="text-slate-404" />
                  <span>Citations & References list</span>
                </span>
                
                <ul className="space-y-2 text-xs text-slate-650">
                  {selectedFinding.sources.map((src, idx) => (
                    <li key={idx} className="flex gap-2 items-start leading-snug">
                      <span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-1 py-0.2 border border-indigo-100 rounded">
                        [{idx + 1}]
                      </span>
                      <span className="italic text-slate-705 text-[11.5px]">{src}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom utilities share / download pdf */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-mono text-slate-450 mt-auto">
              <span>Output node ID: #{selectedFinding.id}</span>
              
              <button
                id="btn-inspector-export"
                onClick={() => onExportSingle(selectedFinding)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-805 flex items-center gap-1 cursor-pointer hover:underline"
              >
                <Download size={12} />
                <span>Download Report Text</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-16 text-center text-slate-400 italic flex flex-col items-center justify-center gap-4 min-h-[400px]">
            <Award size={36} className="text-slate-300 animate-pulse" />
            <div className="flex flex-col gap-1.5 max-w-[320px]">
              <span className="font-bold text-slate-700 text-sm font-display uppercase">
                st.info("No Active Node")
              </span>
              <span>Please select a research finding from the left-side database list to read the fully rendered scientific document workspace.</span>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full p-6 text-left flex flex-col gap-4 shadow-xl">
            <h4 className="font-display font-black text-lg text-slate-800 uppercase tracking-tight">
              Delete Document?
            </h4>
            
            <p className="text-slate-600 text-xs leading-relaxed">
              Are you absolutely sure you want to delete this research log node permanently? This action cannot be reversed within the persistent localStorage matrix.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                id="delete-modal-btn-cancel"
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                No, Keep Card
              </button>
              <button
                id="delete-modal-btn-confirm"
                onClick={() => {
                  onDeleteFinding(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Yes, Delete Permanent
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
