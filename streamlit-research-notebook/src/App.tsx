/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { initialFindings } from './initialData';
import { ResearchFinding, ResearchStats } from './types';
import Sidebar from './components/Sidebar';
import FindingsExplorer from './components/FindingsExplorer';
import DataFrameView from './components/DataFrameView';
import ResearchForm from './components/ResearchForm';
import { 
  Plus, Play, RefreshCw, Star, BarChart, 
  Layers, CheckCircle, HelpCircle, GraduationCap, X, CircleCheck, Info
} from 'lucide-react';

export default function App() {
  // --- 1. Persistent State Management ---
  const [findings, setFindings] = useState<ResearchFinding[]>(() => {
    const saved = localStorage.getItem('streamlit_research_findings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached findings, loading initial preset data.', e);
      }
    }
    return initialFindings;
  });

  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(() => {
    const saved = localStorage.getItem('streamlit_research_findings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed[0].id : null;
      } catch (e) {}
    }
    return initialFindings[0]?.id || null;
  });

  // --- 2. Active Tab & Form States ---
  const [activeTab, setActiveTab] = useState<'explore' | 'add' | 'dataframe'>('explore');
  const [editingFinding, setEditingFinding] = useState<ResearchFinding | null>(null);

  // --- 3. Sidebar Filtering States ---
  const [keyword, setKeyword] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minConfidence, setMinConfidence] = useState<number>(0);
  const [minImportance, setMinImportance] = useState<number>(1);
  const [activeStatus, setActiveStatus] = useState<string>('All');

  // --- 4. Interactive Simulation & Alert States ---
  const [isRunning, setIsRunning] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'warn' | 'info'; message: string } | null>(null);

  // Auto-backup to localStorage whenever database changes
  useEffect(() => {
    localStorage.setItem('streamlit_research_findings', JSON.stringify(findings));
  }, [findings]);

  // Handle flash message expiration
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Simulate Streamlit full-script rerun loader whenever widgets update
  const triggerSimulation = () => {
    setIsRunning(true);
    const timer = setTimeout(() => setIsRunning(false), 550);
    return () => clearTimeout(timer);
  };

  // Bind widget change triggers to rerun simulation
  useEffect(() => {
    triggerSimulation();
  }, [keyword, selectedCategories, minConfidence, minImportance, activeStatus]);

  // Extract all categories currently available in the database for lists
  const allCategories = useMemo(() => {
    const cats = new Set(findings.map(f => f.category));
    return Array.from(cats);
  }, [findings]);

  // --- 5. Filter Logic ---
  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      // 1. Keyword search check across title, synopsis, and body content
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const matchesQuery = 
          f.title.toLowerCase().includes(q) ||
          f.summary.toLowerCase().includes(q) ||
          f.findings.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 2. Multi-select category match
      if (selectedCategories.length > 0 && !selectedCategories.includes(f.category)) {
        return false;
      }

      // 3. Minimum Confidence range check
      if (f.confidence < minConfidence) return false;

      // 4. Minimum Scientific weight check
      if (f.importance < minImportance) return false;

      // 5. Review level match
      if (activeStatus !== 'All' && f.status !== activeStatus) {
        return false;
      }

      return true;
    });
  }, [findings, keyword, selectedCategories, minConfidence, minImportance, activeStatus]);

  // Find currently active document Node
  const selectedFinding = useMemo(() => {
    return findings.find(f => f.id === selectedFindingId) || null;
  }, [findings, selectedFindingId]);

  // --- 6. Analytics Highlights Calculations ---
  const stats: ResearchStats = useMemo(() => {
    const total = findings.length;
    const avgConf = total > 0 ? Math.round(findings.reduce((acc, f) => acc + f.confidence, 0) / total) : 0;
    const drafts = findings.filter(f => f.status === 'Draft').length;
    const completed = findings.filter(f => f.status === 'Completed').length;
    
    return {
      totalFindings: total,
      avgConfidence: avgConf,
      draftsCount: drafts,
      completedCount: completed
    };
  }, [findings]);

  // --- 7. Controller Actions ---

  // Reset preset DB values
  const handleResetDatabase = () => {
    if (window.confirm('Are you sure you want to revert to default sample findings? All personal logs will be cleared.')) {
      setFindings(initialFindings);
      setSelectedFindingId(initialFindings[0].id);
      setActiveTab('explore');
      setKeyword('');
      setSelectedCategories([]);
      setMinConfidence(0);
      setMinImportance(1);
      setActiveStatus('All');
      setAlert({ type: 'info', message: 'st.success("Preset data frames restructed successfully!")' });
      triggerSimulation();
    }
  };

  // Download entire database as JSON file
  const handleExportDatabase = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(findings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'streamlit_research_database_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setAlert({ type: 'success', message: 'st.success("Successfully exported current findings JSON database file.")' });
  };

  // Download single study view
  const handleExportSingleReport = (finding: ResearchFinding) => {
    const bodyStr = `========================================================
STREAMLIT RESEARCH NOTEBOOK EXPORT REPORT
========================================================
ID NODE: #${finding.id}
TITLE: ${finding.title.toUpperCase()}
ACADEMIC CATEGORY: ${finding.category}
LOGGED DATE: ${new Date(finding.createdAt).toLocaleString()}
REVIEW STATUS: ${finding.status}
CONFIDENCE ACCURACY RATIO: ${finding.confidence}%
SCIENTIFIC WEAPON WEIGHT: ${finding.importance}/10

SUMMARY SYNOPSIS:
"${finding.summary}"

--------------------------------------------------------
RESEARCH LOG (MARKDOWN SOURCE):
--------------------------------------------------------
${finding.findings}

--------------------------------------------------------
BIBLIOGRAPHY CITATIONS:
${finding.sources.map((s, i) => `[${i + 1}] ${s}`).join('\n')}
========================================================`;

    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(bodyStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `scientific_findings_report_${finding.id}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setAlert({ type: 'success', message: `st.success("Exported '${finding.title.slice(0,25)}...' txt file!")` });
  };

  // Delete matching node
  const handleDeleteFinding = (id: string) => {
    const updated = findings.filter(f => f.id !== id);
    setFindings(updated);
    
    // Choose replacement focus if deleted selected element
    if (selectedFindingId === id) {
      setSelectedFindingId(updated.length > 0 ? updated[0].id : null);
    }
    
    setAlert({ type: 'warn', message: 'st.warning("Deleted research document entry from local state.")' });
    triggerSimulation();
  };

  // Save new or edit log
  const handleSaveFinding = (newData: Omit<ResearchFinding, 'id' | 'createdAt'>) => {
    if (editingFinding) {
      // EDIT MODE
      const updated = findings.map(f => {
        if (f.id === editingFinding.id) {
          return {
            ...f,
            ...newData
          };
        }
        return f;
      });
      setFindings(updated);
      setSelectedFindingId(editingFinding.id);
      setEditingFinding(null);
      setAlert({ type: 'success', message: 'st.success("Finding compiled and re-saved successfully!")' });
    } else {
      // NEW MODE
      const newId = String(Date.now());
      const newFinding: ResearchFinding = {
        ...newData,
        id: newId,
        createdAt: new Date().toISOString()
      };
      setFindings([newFinding, ...findings]);
      setSelectedFindingId(newId);
      setAlert({ type: 'success', message: 'st.success("New research finding logged and cataloged!")' });
    }

    setActiveTab('explore');
    triggerSimulation();
  };

  const handleEditInit = (finding: ResearchFinding) => {
    setEditingFinding(finding);
    setActiveTab('add');
  };

  const handleSelectFindingNodeFromGrid = (f: ResearchFinding) => {
    setSelectedFindingId(f.id);
    setActiveTab('explore');
    
    // Smoothly scroll to the Focused Inspector on mobile layouts
    const inspectorElem = document.getElementById('finding-focused-inspector');
    if (inspectorElem) {
      inspectorElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fdfdfd]">
      
      {/* Streamlit Iconic Top Brand Ribbon Bar */}
      <div className="h-[3px] w-full bg-indigo-600 shrink-0" />

      {/* Top Application header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between select-none shrink-0 z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
            <GraduationCap size={20} className="stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-display font-extrabold text-[15px] sm:text-[17px] text-slate-800 tracking-tight uppercase leading-none">
              Studio Research Workspace
            </h1>
            <p className="text-xs text-slate-400 mt-1 select-none font-medium">
              Autonomous multi-parameter data-logging framework
            </p>
          </div>
        </div>

        {/* Real-time Status / Simulated running script */}
        <div className="flex items-center gap-3 select-none">
          {isRunning ? (
            <div className="flex items-center gap-2 bg-[#f5f3ff] border border-indigo-100 rounded-full px-3 py-1 text-indigo-600 text-[10.5px] font-bold font-mono">
              <RefreshCw size={12} className="animate-spin text-indigo-600" />
              <span>Running st.rerun()...</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-xs font-medium font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Engine Status: Ready</span>
            </div>
          )}
        </div>
      </header>

      {/* App Main Layout wrapper */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* State Connected Left Sidebar (Streamlit panel) */}
        <Sidebar
          keyword={keyword}
          setKeyword={setKeyword}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          minConfidence={minConfidence}
          setMinConfidence={setMinConfidence}
          minImportance={minImportance}
          setMinImportance={setMinImportance}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          onReset={handleResetDatabase}
          onExport={handleExportDatabase}
          allCategories={allCategories}
          findingsCount={findings.length}
          filteredCount={filteredFindings.length}
        />

        {/* Central main code stage content container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto flex flex-col gap-6">
          
          {/* Top Title Metrics display Columns */}
          <div className="flex flex-col gap-1.5 select-none">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-800 tracking-tight flex items-baseline gap-1.5 uppercase">
              Scientific Research Findings Notebook
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 inline-block" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
              Log, categorize, aggregate, and review empirical discoveries and academic findings. Includes multi-widget active sidebar threshold filtering and fully compiled markdown visual outputs.
            </p>
          </div>

          {/* 📊 Streamlit Metrics Block (st.columns & st.metric simulator) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
            
            {/* Metric 1 */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-0.5 shadow-xs relative overflow-hidden group hover:border-indigo-600 transition-all">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <span>Total Findings Logged</span>
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-800 font-display">
                  {stats.totalFindings}
                </span>
                <span className="text-[10.5px] font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1 py-0.2 rounded">
                  +100% active
                </span>
              </div>
              <p className="text-[9.5px] text-slate-400 mt-1 font-mono italic">
                index.size_ratio_nodes
              </p>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-0.5 shadow-xs relative overflow-hidden group hover:border-indigo-600 transition-all">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Avg Research Confidence
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-800 font-display">
                  {stats.avgConfidence}%
                </span>
                <span className="text-[10.5px] font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1 py-0.2 rounded">
                  {stats.avgConfidence > 80 ? 'Optimal' : 'Variable'}
                </span>
              </div>
              <p className="text-[9.5px] text-slate-400 mt-1 font-mono italic">
                st.metric_confidence
              </p>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-0.5 shadow-xs relative overflow-hidden group hover:border-indigo-600 transition-all">
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">
                Maturity Distribution
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-800 font-display">
                  {stats.completedCount}
                </span>
                <span className="text-xs text-slate-400">/ {stats.totalFindings} Verified</span>
              </div>
              <p className="text-[9.5px] text-slate-400 mt-1 font-mono italic">
                status.completed_nodes
              </p>
            </div>

            {/* Metric 4 */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-0.5 shadow-xs relative overflow-hidden group hover:border-indigo-600 transition-all">
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">
                Remaining Drafts
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-800 font-display">
                  {stats.draftsCount}
                </span>
                <span className="text-[10.5px] font-mono text-amber-600 font-bold bg-amber-50 border border-amber-100 px-1 py-0.2 rounded animate-pulse">
                  Working
                </span>
              </div>
              <p className="text-[9.5px] text-slate-400 mt-1 font-mono italic">
                st.metric_draft_queue
              </p>
            </div>

          </div>

          {/* Alert Message Banner (Simulation of st.success() / st.warning()) */}
          {alert && (
            <div 
              id="streamlit-alert-banner" 
              className={`p-3 px-4.5 rounded-lg border text-xs font-mono font-medium flex items-center justify-between gap-3 animate-fade-in ${
                alert.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-150 text-emerald-800' 
                  : alert.type === 'warn' 
                    ? 'bg-amber-50 border-amber-150 text-amber-805 text-amber-800' 
                    : 'bg-indigo-50 border-indigo-150 text-indigo-805'
              }`}
            >
              <div className="flex items-center gap-2">
                <CircleCheck size={14} className={alert.type === 'success' ? 'text-emerald-600' : alert.type === 'warn' ? 'text-amber-500' : 'text-indigo-605'} />
                <span>{alert.message}</span>
              </div>
              <button 
                id="btn-close-alert"
                onClick={() => setAlert(null)} 
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* 🎛️ Streamlit-style Navigation Tabs (st.tabs) */}
          <div className="flex border-b border-slate-200 select-none pb-px">
            <button
              id="tab-btn-explore"
              onClick={() => {
                setEditingFinding(null);
                setActiveTab('explore');
                triggerSimulation();
              }}
              className={`px-5 py-2.5 font-display font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'explore' && !editingFinding ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
            >
              <span>🔍 Explore Findings Node</span>
            </button>

            <button
              id="tab-btn-add"
              onClick={() => {
                setActiveTab('add');
                triggerSimulation();
              }}
              className={`px-5 py-2.5 font-display font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'add' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
            >
              <span>{editingFinding ? '✍🏽 Edit Active Log' : '✍🏽 Add New Log'}</span>
            </button>

            <button
              id="tab-btn-dataframe"
              onClick={() => {
                setEditingFinding(null);
                setActiveTab('dataframe');
                triggerSimulation();
              }}
              className={`px-5 py-2.5 font-display font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'dataframe' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
            >
              <span>📊 Spreadsheet & Aggregates</span>
            </button>
          </div>

          {/* Primary View Router */}
          <div className="flex-1">
            {activeTab === 'explore' && (
              <FindingsExplorer
                findings={filteredFindings}
                selectedFinding={selectedFinding}
                onSelectFinding={(f) => setSelectedFindingId(f.id)}
                onEditFinding={handleEditInit}
                onDeleteFinding={handleDeleteFinding}
                onExportSingle={handleExportSingleReport}
              />
            )}

            {activeTab === 'add' && (
              <ResearchForm
                findingToEdit={editingFinding}
                allCategories={allCategories}
                onSave={handleSaveFinding}
                onCancel={() => {
                  setEditingFinding(null);
                  setActiveTab('explore');
                }}
              />
            )}

            {activeTab === 'dataframe' && (
              <DataFrameView
                findings={filteredFindings}
                onSelectFinding={handleSelectFindingNodeFromGrid}
              />
            )}
          </div>

        </main>
      </div>

      {/* Humble Footer in conformity with strict "Anti-AI-Slop No telemetry" requirements */}
      <footer className="bg-white border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 select-none shrink-0">
        <span>Active Storage Mode: Local Browser Cache</span>
        <span>Made with Node/React & Streamlit Aesthetic Pairings</span>
      </footer>

    </div>
  );
}

