import React from 'react';
import { 
  FileText, HelpCircle, 
  RotateCcw, ShieldCheck, Database, 
  Tag, Download, Layers, ExternalLink
} from 'lucide-react';
import { ResearchFinding } from '../types';

interface SidebarProps {
  // Filter states
  keyword: string;
  setKeyword: (val: string) => void;
  
  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;
  
  minConfidence: number;
  setMinConfidence: (val: number) => void;
  
  minImportance: number;
  setMinImportance: (val: number) => void;
  
  activeStatus: string;
  setActiveStatus: (val: string) => void;
  
  // Base Actions
  onReset: () => void;
  onExport: () => void;
  
  // Available list values
  allCategories: string[];
  findingsCount: number;
  filteredCount: number;
}

export default function Sidebar({
  keyword,
  setKeyword,
  selectedCategories,
  setSelectedCategories,
  minConfidence,
  setMinConfidence,
  minImportance,
  setMinImportance,
  activeStatus,
  setActiveStatus,
  onReset,
  onExport,
  allCategories,
  findingsCount,
  filteredCount
}: SidebarProps) {

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <aside id="streamlit-sidebar" className="w-full md:w-[320px] bg-white border-r border-slate-150 p-6 flex flex-col gap-6 select-none shrink-0 overflow-y-auto">
      {/* Streamlit Top Header branding */}
      <div className="flex flex-col gap-1 border-b border-slate-150 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center text-white text-xs font-bold leading-none shadow-xs font-sans">
            S
          </div>
          <span className="font-display font-black text-sm text-slate-900 tracking-wider uppercase">
            STUDIO.RESEARCH
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-mono">
          Autonomous Notebook • local-python-env
        </p>
      </div>

      {/* Navigation / Run State simulation */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Applet Script Engine
        </label>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-700">Script is Live</span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
            st.rerun() auto
          </span>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="flex flex-col gap-5">
        <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">
          sidebar.widgets()
        </h3>

        {/* Text Input Widget */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <span>st.text_input("Refine by Keyword")</span>
          </label>
          <input
            id="sidebar-keyword-input"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Type search terms..."
            className="w-full text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-600 transition-all"
          />
        </div>

        {/* Dropdown Widget */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            st.selectbox("Maturity Status")
          </label>
          <select
            id="sidebar-status-select"
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value)}
            className="w-full text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-600 transition-all cursor-pointer"
          >
            <option value="All">All Severity Nodes (All)</option>
            <option value="Draft">Draft Only</option>
            <option value="In Review">In Review Only</option>
            <option value="Completed">Completed / Verified</option>
          </select>
        </div>

        {/* Range Slider 1: Confidence */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span>st.slider("Min Confidence %")</span>
            <span className="font-mono text-[11px] text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded font-bold">
              {minConfidence}%
            </span>
          </div>
          <input
            id="sidebar-confidence-slider"
            type="range"
            min="0"
            max="100"
            value={minConfidence}
            step="5"
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <span className="text-[10px] text-slate-400 flex justify-between font-mono">
            <span>0%</span>
            <span>Target threshold limit</span>
            <span>100%</span>
          </span>
        </div>

        {/* Range Slider 2: Importance */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span>st.slider("Min Importance Score")</span>
            <span className="font-mono text-[11px] text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded font-bold">
              {minImportance}/10
            </span>
          </div>
          <input
            id="sidebar-importance-slider"
            type="range"
            min="1"
            max="10"
            value={minImportance}
            step="1"
            onChange={(e) => setMinImportance(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <span className="text-[10px] text-slate-400 flex justify-between font-mono">
            <span>1 (Low)</span>
            <span>Scale level</span>
            <span>10 (Critical)</span>
          </span>
        </div>

        {/* Multiselect Categories */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>st.multiselect("Filter Category")</span>
            {selectedCategories.length > 0 && (
              <button
                id="sidebar-clear-cats-btn"
                onClick={() => setSelectedCategories([])}
                className="text-[10px] text-slate-500 hover:text-indigo-600 font-semibold cursor-pointer underline"
              >
                Clear
              </button>
            )}
          </label>
          <div className="bg-white rounded border border-slate-200 p-2 max-h-[140px] overflow-y-auto flex flex-col gap-1.5">
            {allCategories.length === 0 ? (
              <span className="text-[10px] text-slate-400 italic">No categories loaded</span>
            ) : (
              allCategories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  <input
                    id={`checkbox-cat-${cat.replace(/\s+/g, '-')}`}
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-indigo-600 h-3 w-3 rounded text-white"
                  />
                  <span>{cat}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Streamlit Custom Alert Box */}
      <div className="mt-auto bg-slate-50 border border-slate-150 rounded-lg p-3 text-[11px] text-slate-600 flex flex-col gap-1">
        <div className="font-bold flex items-center gap-1.5 text-slate-800">
          <Layers size={13} className="text-indigo-600" />
          <span>st.sidebar.info()</span>
        </div>
        <p className="leading-normal">
          Showing <strong>{filteredCount}</strong> of <strong>{findingsCount}</strong> total findings matching your active python engine filter parameters.
        </p>
      </div>

      {/* Button widget utilities */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          st.sidebar.button() utilities
        </label>
        
        {/* Export JSON Database */}
        <button
          id="btn-sidebar-export"
          onClick={onExport}
          className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-semibold rounded py-1.5 text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Download size={13} className="text-slate-500" />
          <span>Export Research (JSON)</span>
        </button>

        {/* Reset Database */}
        <button
          id="btn-sidebar-reset"
          onClick={onReset}
          className="w-full bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-605 border border-slate-200 hover:border-rose-100 font-semibold rounded py-1.5 text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
          title="Restore original preset database"
        >
          <RotateCcw size={13} />
          <span>Reset Default Database</span>
        </button>
      </div>
    </aside>
  );
}
