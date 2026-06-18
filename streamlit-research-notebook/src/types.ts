export interface ResearchFinding {
  id: string;
  title: string;
  category: string;
  summary: string;
  findings: string; // Markdown supported findings detail
  confidence: number; // 0 - 100 % (Streamlit-style slider)
  importance: number; // 1 - 10 (Streamlit-style slider)
  status: 'Draft' | 'In Review' | 'Completed'; // Streamlit-style selectbox
  sources: string[];
  tags: string[];
  createdAt: string;
}

export interface ResearchStats {
  totalFindings: number;
  avgConfidence: number;
  draftsCount: number;
  completedCount: number;
}
