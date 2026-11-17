export type TaskLabel = 'Feature' | 'Bug' | 'Issue' | 'Undefined';
export type Priority = 'Low' | 'Medium' | 'High';

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  email: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  assigneeIds: string[];
  dueDate: string;
  label: TaskLabel;
  priority: Priority;
  checklist: ChecklistItem[];
  attachments: TaskAttachment[];
  coverImage?: string;
  createdAt: string;
}

export interface BoardColumn {
  id: string;
  title: string;
}
