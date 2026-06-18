import React, { useState, useMemo } from 'react';
import { ResearchFinding } from '../types';
import { 
  ArrowUpDown, Search, Calendar, CheckCircle, 
  AlertCircle, FileX, BarChart2, TrendingUp, HelpCircle
} from 'lucide-react';

interface DataFrameViewProps {
  findings: ResearchFinding[];
  onSelectFinding: (finding: ResearchFinding) => void;
}

type SortField = 'title' | 'category' | 'confidence' | 'importance' | 'status' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function DataFrameView({ findings, onSelectFinding }: DataFrameViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Multi-column sorting & Filtering
  const sortedAndFiltered = useMemo(() => {
    let result = [...findings];
    
    // Core keyword filtering across Title, Summary & Content
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(f => 
        f.title.toLowerCase().includes(query) ||
        f.summary.toLowerCase().includes(query) ||
        f.findings.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query) ||
        f.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Sort evaluation or matching field
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [findings, searchTerm, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // 1. Math computation for visual SVG graphs: Count of findings group by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    findings.forEach(f => {
      counts[f.category] = (counts[f.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [findings]);

  // Compute maximum count to scale SVG bars properly
  const maxCategoryCount = useMemo(() => {
    const values = categoryCounts.map(c => c.count);
    return values.length > 0 ? Math.max(...values) : 1;
  }, [categoryCounts]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return classNameToFormatDate(d);
  };

  const classNameToFormatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusBadges = {
    Completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'In Review': 'bg-amber-50 text-amber-800 border-amber-200',
    Draft: 'bg-slate-50 text-slate-600 border-slate-200'
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 📊 Section stats plots / st.bar_chart mockups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category breakdown bar plot */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 size={16} className="text-indigo-600" />
              <h4 className="font-display font-bold text-sm text-slate-800">
                st.bar_chart("Volume by Research Category")
              </h4>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
              category.aggregations
            </span>
          </div>

          {categoryCounts.length === 0 ? (
            <div className="h-[180px] flex items-center justify-center text-xs text-slate-400 italic">
              No categories populated
            </div>
          ) : (
            <div className="flex flex-col gap-3 h-[180px] justify-center overflow-y-auto pr-1">
              {categoryCounts.map((cat, idx) => {
                const percentage = (cat.count / maxCategoryCount) * 100;
                return (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{cat.name}</span>
                      <span className="font-mono font-bold text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.2 rounded text-[10px]">
                        {cat.count} {cat.count === 1 ? 'doc' : 'docs'}
                      </span>
                    </div>
                    <div className="h-6 w-full bg-slate-100 rounded overflow-hidden relative flex items-center">
                      <div 
                        className="bg-indigo-600/85 h-full rounded transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                      <span className="absolute left-2.5 text-[10px] font-mono text-slate-800 font-semibold drop-shadow-xs">
                        {percentage.toFixed(0)}% relative share
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Confidence vs Importance matrix plots */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600" />
              <h4 className="font-display font-bold text-sm text-slate-800">
                st.scatter_chart("Confidence vs. Importance")
              </h4>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
              findings.scatter_plane
            </span>
          </div>

          <div className="relative h-[180px] w-full border-b border-l border-slate-200 mt-2 bg-slate-50/50 rounded-tr-md">
            {/* Grid Helper lines */}
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-200" />
            <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-slate-200" />
            
            {/* Legend Labels */}
            <span className="absolute right-2 bottom-1.5 text-[9px] font-mono text-slate-400">
              Importance →
            </span>
            <span className="absolute left-1.5 top-2 text-[9px] font-mono text-slate-400 rotate-90 origin-top-left translate-x-3.5">
              Confidence % →
            </span>

            {/* Bubble renders */}
            {findings.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 italic">
                No plot aggregates available
              </div>
            ) : (
              findings.map((f, idx) => {
                // Scale values: x = importance (1 - 10) -> (5% to 92%)
                const leftPercent = 5 + ((f.importance - 1) / 9) * 85;
                // y = confidence (0 - 100) -> (5% to 88%)
                const bottomPercent = 5 + (f.confidence / 100) * 80;
                
                return (
                  <button
                    id={`btn-scatter-plot-node-${f.id}`}
                    key={f.id}
                    onClick={() => onSelectFinding(f)}
                    className="absolute h-4 w-4 bg-indigo-600 hover:bg-slate-900 border border-white rounded-full shadow-md -translate-x-1/2 translate-y-1/2 cursor-pointer transition-transform hover:scale-135 group"
                    style={{ left: `${leftPercent}%`, bottom: `${bottomPercent}%` }}
                    title={`Click to read: "${f.title}" (Confidence: ${f.confidence}%, Importance: ${f.importance}/10)`}
                  >
                    {/* Tooltip on hover */}
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 bg-slate-900 text-white rounded text-[10.5px] px-2 py-1 font-sans font-medium whitespace-nowrap z-50 transition-opacity whitespace-pre-wrap max-w-[190px]">
                      {f.title.length > 22 ? `${f.title.slice(0, 22)}...` : f.title}
                    </span>
                  </button>
                );
              })
            )}

            {/* Scatter grid notes */}
            <div className="absolute right-2 top-2 text-[8px] font-mono text-slate-500 uppercase bg-white/70 border border-slate-200 px-1 rounded">
              Interactive plots
            </div>
          </div>
        </div>

      </div>

      {/* 🔍 Search Input and Interactive Grid DataFrame */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
        
        {/* Table Header toolbar / st.dataframe metadata */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <span>st.dataframe("Global Research Matrix")</span>
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.2 rounded font-bold uppercase">
                interactive
              </span>
            </span>
            <p className="text-xs text-slate-400">
              Double-click any entry metadata line to select and load it directly into focus panel.
            </p>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="df-table-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter data frame rows..."
              className="pl-8/2.5 pr-3 py-1.5 w-full sm:w-[240px] text-xs bg-white border border-slate-200 rounded focus:outline-none focus:border-indigo-600 transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Main interactive Table rendering */}
        <div className="overflow-x-auto">
          <table id="scientific-data-dataframe" className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/55 text-slate-500 text-[11px] font-mono uppercase select-none">
                <th className="p-3.5 pl-5 font-semibold text-slate-600">
                  <button 
                    id="th-btn-sort-title"
                    onClick={() => handleSort('title')} 
                    className="flex items-center gap-1 hover:text-slate-900 cursor-pointer text-left"
                  >
                    <span>Title / Subject Node</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </button>
                </th>
                <th className="p-3.5 font-semibold text-slate-600">
                  <button 
                    id="th-btn-sort-category"
                    onClick={() => handleSort('category')} 
                    className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Category</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </button>
                </th>
                <th className="p-3.5 text-center font-semibold text-slate-600 w-[100px]">
                  <button 
                    id="th-btn-sort-confidence"
                    onClick={() => handleSort('confidence')} 
                    className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer mx-auto"
                  >
                    <span>Conf. %</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </button>
                </th>
                <th className="p-3.5 text-center font-semibold text-slate-600 w-[100px]">
                  <button 
                    id="th-btn-sort-importance"
                    onClick={() => handleSort('importance')} 
                    className="inline-flex items-center gap-1 hover:text-slate-900 cursor-pointer mx-auto"
                  >
                    <span>Import.</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </button>
                </th>
                <th className="p-3.5 font-semibold text-slate-600 w-[110px]">
                  <button 
                    id="th-btn-sort-status"
                    onClick={() => handleSort('status')} 
                    className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Status</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </button>
                </th>
                <th className="p-3.5 font-semibold text-slate-600 w-[120px]">
                  <button 
                    id="th-btn-sort-created"
                    onClick={() => handleSort('createdAt')} 
                    className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Logged Date</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </button>
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {sortedAndFiltered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400 italic font-medium bg-slate-50/50">
                    <div className="flex flex-col items-center gap-2">
                      <FileX size={24} className="text-slate-350" />
                      <span>No matching findings currently satisfy active data constraints.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedAndFiltered.map((f) => (
                  <tr 
                    key={f.id}
                    onClick={() => onSelectFinding(f)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    {/* Title & summary */}
                    <td className="p-3.5 pl-5 max-w-[320px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-800 group-hover:text-indigo-650 transition-colors line-clamp-1">
                          {f.title}
                        </span>
                        <span className="text-slate-400 text-[11px] line-clamp-1 italic font-light">
                          {f.summary}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3.5">
                      <span className="font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                        {f.category}
                      </span>
                    </td>

                    {/* Confidence percentage bar */}
                    <td className="p-3.5 text-center font-mono font-bold text-slate-700">
                      <div className="flex items-center gap-1.5 justify-center">
                        <span>{f.confidence}%</span>
                        <div className="hidden sm:block w-8 h-2 bg-slate-100 rounded overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded" 
                            style={{ width: `${f.confidence}%` }} 
                          />
                        </div>
                      </div>
                    </td>

                    {/* Importance */}
                    <td className="p-3.5 text-center">
                      <span className="font-mono bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded font-bold">
                        {f.importance}/10
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="p-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-semibold ${statusBadges[f.status] || 'bg-slate-100'}`}>
                        {f.status}
                      </span>
                    </td>

                    {/* Date Created */}
                    <td className="p-3.5 text-slate-500 whitespace-nowrap font-sans text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{formatDate(f.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        <div className="bg-slate-50 p-3 px-5 border-t border-slate-200 flex justify-between items-center text-[11px] font-mono text-slate-500 select-none">
          <span>Row constraints mapping: (st.dataframe)</span>
          <span>Displayed: <strong>{sortedAndFiltered.length}</strong> row(s) output</span>
        </div>

      </div>

    </div>
  );
}
