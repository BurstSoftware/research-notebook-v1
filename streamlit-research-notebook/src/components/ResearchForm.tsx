import React, { useState, useEffect } from 'react';
import { ResearchFinding } from '../types';
import { 
  Plus, Edit2, Check, ArrowLeft, Eye, 
  BookOpen, Sliders, Tag, Link2, AlertTriangle, FileText
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface ResearchFormProps {
  findingToEdit?: ResearchFinding | null;
  onSave: (newData: Omit<ResearchFinding, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  allCategories: string[];
}

export default function ResearchForm({ 
  findingToEdit, 
  onSave, 
  onCancel,
  allCategories
}: ResearchFormProps) {
  
  // Local active states mapping
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Quantum Materials');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCatMode, setIsCustomCatMode] = useState(false);
  const [summary, setSummary] = useState('');
  const [findings, setFindings] = useState('');
  const [confidence, setConfidence] = useState(80);
  const [importance, setImportance] = useState(5);
  const [status, setStatus] = useState<'Draft' | 'In Review' | 'Completed'>('Draft');
  const [tagsInput, setTagsInput] = useState('');
  const [sourcesInput, setSourcesInput] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Load editing context
  useEffect(() => {
    if (findingToEdit) {
      setTitle(findingToEdit.title);
      setSummary(findingToEdit.summary);
      setFindings(findingToEdit.findings);
      setConfidence(findingToEdit.confidence);
      setImportance(findingToEdit.importance);
      setStatus(findingToEdit.status);
      setTagsInput(findingToEdit.tags.join(', '));
      setSourcesInput(findingToEdit.sources.join('\n'));
      
      // Handle category matching
      if (allCategories.includes(findingToEdit.category)) {
        setCategory(findingToEdit.category);
        setIsCustomCatMode(false);
      } else {
        setCategory('Custom');
        setCustomCategory(findingToEdit.category);
        setIsCustomCatMode(true);
      }
    } else {
      // Default state reset
      setTitle('');
      setCategory(allCategories[0] || 'Quantum Materials');
      setCustomCategory('');
      setIsCustomCatMode(false);
      setSummary('');
      setFindings('');
      setConfidence(80);
      setImportance(5);
      setStatus('Draft');
      setTagsInput('');
      setSourcesInput('');
    }
  }, [findingToEdit, allCategories]);

  // Quick preset loader helper to help developer or user not write manual markdown
  const loadTemplateMarkdown = () => {
    const templateContent = `### 1. Abstract
Briefly outline the core hypothesis or discovery here...

### 2. Analytical Model
Describe the underlying framework or mathematical apparatus:
- **Major Parameter Alpha**: Measured boundary stress
- **Secondary Loop Gamma**: Epistemic feedback limits

### 3. Empirical Results
\`\`\`javascript
// Raw Telemetry Stream Log
const sampleMeasurement = {
  voltageDrop: 0.0024,
  criticalTemperatureKelvin: 142.5,
  anomalousDiamagnetismRegistered: true
};
console.log(sampleMeasurement);
\`\`\`

> Implication: The physical matrix shows high correlation index. Modify synthesis protocols in Phase C.

### 4. Sources & Verification Nodes
Add bibliographic citations at the foot notes.`;
    setFindings(templateContent);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Research title is required.';
    if (!summary.trim()) newErrors.summary = 'A summary synopsis is required.';
    if (!findings.trim()) newErrors.findings = 'Detailed markdown findings content is required.';
    if (isCustomCatMode && !customCategory.trim()) newErrors.customCategory = 'Please enter standard custom category.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Compile values to lists
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const sources = sourcesInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const compiledCategory = isCustomCatMode ? customCategory.trim() : category;

    onSave({
      title: title.trim(),
      category: compiledCategory,
      summary: summary.trim(),
      findings: findings.trim(),
      confidence,
      importance,
      status,
      tags,
      sources
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col gap-6">
      
      {/* Page Title header panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <button
            id="form-btn-back"
            onClick={onCancel}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft size={14} />
          </button>
          
          <div className="flex flex-col">
            <h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">
              {findingToEdit ? <Edit2 size={16} className="text-indigo-600" /> : <Plus size={16} className="text-indigo-600" />}
              <span>{findingToEdit ? 'Edit Stored Finding Log' : 'Create New Research Document'}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              st.sidebar.button() / callback integration
            </span>
          </div>
        </div>

        {/* Templates loader */}
        {!findingToEdit && (
          <button
            id="form-btn-template"
            type="button"
            onClick={loadTemplateMarkdown}
            className="text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-100 hover:border-sky-200 rounded px-3 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText size={13} />
            <span>Load Scientific Template Markdown</span>
          </button>
        )}
      </div>

      <form id="research-notebook-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Row 1: Title & Category Choice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
              <span>st.text_input("Title of Findings")</span>
              <span className="text-red-500">*</span>
            </span>
            <input
              id="form-field-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Anomalous Electro-magnetic Resonance in Hexagonal Boron Nitride v1.2"
              className={`w-full text-xs text-slate-800 bg-white border rounded px-3 py-2 focus:outline-none focus:border-indigo-600 transition-all ${errors.title ? 'border-red-400 focus:border-red-400' : 'border-slate-200'}`}
            />
            {errors.title && <span className="text-[10px] font-semibold text-red-500 flex items-center gap-1"><AlertTriangle size={10} />{errors.title}</span>}
          </div>

          {/* Category SELECT BOX */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
              <span>st.selectbox("Academic Category Node")</span>
            </span>
            {isCustomCatMode ? (
              <div className="flex gap-2">
                <input
                  id="form-field-custom-category"
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category label..."
                  className={`flex-1 text-xs text-slate-800 bg-white border rounded px-3 py-2 focus:outline-none focus:border-indigo-600 transition-all ${errors.customCategory ? 'border-red-400' : 'border-slate-200'}`}
                />
                <button
                  id="btn-cancel-custom-cat"
                  type="button"
                  onClick={() => setIsCustomCatMode(false)}
                  className="text-xs font-semibold px-2 border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Options
                </button>
              </div>
            ) : (
              <select
                id="form-field-category-dropdown"
                value={category}
                onChange={(e) => {
                  if (e.target.value === 'Custom') {
                    setIsCustomCatMode(true);
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-2 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer"
              >
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Custom">+ Register Custom Category...</option>
              </select>
            )}
            {errors.customCategory && <span className="text-[10px] font-semibold text-red-500"><AlertTriangle size={10} className="inline mr-1" />{errors.customCategory}</span>}
          </div>
        </div>

        {/* Row 2: Synopsis/Summary (concise text_input) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
            <span>st.text_input("One-sentence Synopsis Summary")</span>
            <span className="text-red-500">*</span>
          </span>
          <input
            id="form-field-summary"
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="e.g., Captured magnetic flux quantization inside ultra-precise lead ring microstructures at scale."
            className={`w-full text-xs text-slate-800 bg-white border rounded px-3 py-20/2 focus:outline-none focus:border-indigo-600 py-2 transition-all ${errors.summary ? 'border-red-400' : 'border-slate-200'}`}
          />
          {errors.summary && <span className="text-[10px] font-semibold text-red-500 flex items-center gap-1"><AlertTriangle size={10} />{errors.summary}</span>}
        </div>

        {/* Row 3: Confidence & Importance & Status (Streamlit columns simulator) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-4 rounded-xl border border-slate-150">
          
          {/* Confide Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 uppercase">st.slider("Assigned Confidence")</span>
              <span className="font-mono text-xs font-bold text-indigo-600">{confidence}%</span>
            </div>
            <input
              id="form-field-confidence-range"
              type="range"
              min="0"
              max="100"
              step="5"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="accent-indigo-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 text-center font-mono italic">
              Estimated replication status
            </span>
          </div>

          {/* Importance Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 uppercase">st.slider("Scientific Weight")</span>
              <span className="font-mono text-xs font-bold text-indigo-600">{importance}/10</span>
            </div>
            <input
              id="form-field-importance-range"
              type="range"
              min="1"
              max="10"
              step="1"
              value={importance}
              onChange={(e) => setImportance(Number(e.target.value))}
              className="accent-indigo-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 text-center font-mono italic">
              Academic leverage index
            </span>
          </div>

          {/* Maturity Status Select */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase">st.selectbox("Maturity Level")</span>
            <select
              id="form-field-status-dropdown"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer"
            >
              <option value="Draft">Draft (Internal Working Hypothesis)</option>
              <option value="In Review">In Review (Peer Verification)</option>
              <option value="Completed">Completed (Verified & Published)</option>
            </select>
            <span className="text-[10px] text-slate-400 text-center font-mono italic">
              Log phase marker
            </span>
          </div>

        </div>

        {/* Row 4: Side By Side Detailed Markdown text_area & live preview */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
              <span>st.text_area("Detailed Findings (Scientific Markdown Supported)")</span>
              <span className="text-red-500">*</span>
            </span>
            <button
              id="btn-toggle-preview"
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="text-xs font-semibold hover:text-slate-900 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded px-2 py-1 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Eye size={12} />
              <span>{showLivePreview ? 'Hide Sidebar Preview' : 'Show Live Preview'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Input Column */}
            <div className="flex flex-col gap-2">
              <textarea
                id="form-field-findings"
                rows={11}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Write logs, protocols, data frames using standard markdown blocks:
# Heading 1
- Lists of records
- Double asterisks for **bold highlights**
`code snippets`
```python
# python code
```"
                className={`w-full text-xs text-slate-800 bg-white border rounded p-3 focus:outline-none focus:border-indigo-600 font-mono leading-relaxed resize-y ${errors.findings ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.findings ? (
                <span className="text-[10px] font-semibold text-red-500 flex items-center gap-1">
                  <AlertTriangle size={10} />
                  {errors.findings}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">
                  Tip: Supports full multi-line scientific abstracts, markdown structures and embedded scripts.
                </span>
              )}
            </div>

            {/* Live Render compiled output Column */}
            {showLivePreview ? (
              <div className="bg-slate-50 border border-slate-200 rounded p-4 h-[241px] lg:h-[268px] overflow-y-auto">
                <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase block mb-3 w-fit select-none">
                  st.markdown() live preview
                </span>
                {!findings.trim() ? (
                  <span className="text-xs text-slate-400 italic">Preview compiles here in real-time as you write...</span>
                ) : (
                  <MarkdownRenderer content={findings} />
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded flex items-center justify-center p-4 h-[240px]">
                <span className="text-xs text-slate-400 italic">Live preview pane collapsed. Toggle above.</span>
              </div>
            )}

          </div>

        </div>

        {/* Row 5: Tags list & References */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <Tag size={13} className="text-slate-400" />
              <span>st.text_input("Keywords / Academic Tags")</span>
            </span>
            <input
              id="form-field-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g., Materials Science, Nanotech, Superconductors"
              className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-indigo-600 transition-all"
            />
            <span className="text-[10px] text-slate-400 italic">
              Comma-separated list (e.g. quantum, physics, energy)
            </span>
          </div>

          {/* References */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <Link2 size={13} className="text-slate-400" />
              <span>st.text_area("Source Citations & Bibliography")</span>
            </span>
            <textarea
              id="form-field-sources"
              rows={2}
              value={sourcesInput}
              onChange={(e) => setSourcesInput(e.target.value)}
              placeholder="e.g., Journal of Superfluids, Oct 2024&#10;Lab Record File #102B"
              className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded p-3 focus:outline-none focus:border-indigo-600 transition-all resize-none font-mono"
            />
            <span className="text-[10px] text-slate-400 italic">
              Input each research reference or URL on a separate line
            </span>
          </div>
        </div>

        {/* Action Panel submit widgets */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            id="form-btn-cancel"
            type="button"
            onClick={onCancel}
            className="px-5 py-2 hover:bg-slate-100 border border-slate-200 text-slate-600 bg-white rounded font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            id="form-btn-submit"
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Check size={14} />
            <span>{findingToEdit ? 'Save & Recompile Log' : 'Publish & Save Finding'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
