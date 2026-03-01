export interface Task {
  id: string;
  name: string;
  department: string;
  duration_days: { min: number; p50: number; max: number };
  required_docs: string[];
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TaskGroup {
  phase: number;
  name: string;
  tasks: Task[];
  total_duration_days: { min: number; p50: number; max: number };
}

export interface DocChecklistItem {
  name: string;
  category: string;
  required: boolean;
  completed: boolean;
}

export interface DocChecklist {
  category: string;
  items: DocChecklistItem[];
}

export interface RiskRegisterEntry {
  id: string;
  category: string;
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface ProjectPlan {
  id: string;
  name: string;
  project_type: string;
  task_groups: TaskGroup[];
  doc_checklists: DocChecklist[];
  risk_register: RiskRegisterEntry[];
  budget_summary?: {
    total_p50: number;
    department_costs: { department: string; label: string; p50: number }[];
  };
  timeline_summary?: {
    total_p50_days: number;
    phases: { name: string; p50_days: number }[];
  };
  created_at: string;
}
