import type { BoardColumn, Task, TeamMember } from '../types/task';

export const columns: BoardColumn[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
  { id: 'rework', title: 'Rework' },
];

export const members: TeamMember[] = [
  { id: 'm1', name: 'Alex Morgan', initials: 'AM', color: '#e9b49a', email: 'alex@taskflow.dev' },
  { id: 'm2', name: 'Nadia Putri', initials: 'NP', color: '#a9c8bd', email: 'nadia@taskflow.dev' },
  { id: 'm3', name: 'Kevin Lee', initials: 'KL', color: '#b7b4e8', email: 'kevin@taskflow.dev' },
  { id: 'm4', name: 'Sarah Chen', initials: 'SC', color: '#e6b5c4', email: 'sarah@taskflow.dev' },
  { id: 'm5', name: 'Rizky Aditya', initials: 'RA', color: '#e5c77d', email: 'rizky@taskflow.dev' },
];

const today = new Date();
const dateOffset = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const initialTasks: Task[] = [
  {
    id: 't1', title: 'Research for a podcast and video website',
    description: 'Collect references and define the content direction for the upcoming campaign.',
    columnId: 'todo', assigneeIds: ['m1', 'm2'], dueDate: dateOffset(2),
    label: 'Feature', priority: 'Medium',
    checklist: [{ id: 'c1', title: 'Collect competitor references', completed: true }, { id: 'c2', title: 'Prepare research notes', completed: false }],
    attachments: [{ id: 'a1', name: 'research-brief.pdf', size: '1.2 MB' }],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2', title: 'Debug checkout process for the e-commerce website',
    description: 'Investigate the checkout issue and verify the payment flow on mobile devices.',
    columnId: 'todo', assigneeIds: ['m2', 'm3', 'm4'], dueDate: dateOffset(5),
    label: 'Bug', priority: 'High',
    checklist: [{ id: 'c3', title: 'Reproduce checkout issue', completed: true }, { id: 'c4', title: 'Test payment flow', completed: false }],
    attachments: [], createdAt: new Date().toISOString(),
  },
  {
    id: 't3', title: 'Design wireframes for the landing page revamp',
    description: 'Create a clean landing page structure with clear hierarchy and conversion-focused sections.',
    columnId: 'doing', assigneeIds: ['m3', 'm4'], dueDate: dateOffset(3),
    label: 'Feature', priority: 'High',
    checklist: [{ id: 'c5', title: 'Low-fidelity wireframe', completed: true }, { id: 'c6', title: 'Review page sections', completed: false }],
    attachments: [], coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't4', title: 'Install and set up a marketing tool for team operations',
    description: 'Configure workspace access and prepare a short onboarding guide.',
    columnId: 'doing', assigneeIds: ['m1', 'm5'], dueDate: dateOffset(8),
    label: 'Undefined', priority: 'Low',
    checklist: [{ id: 'c7', title: 'Create workspace', completed: false }],
    attachments: [], coverImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=85',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't5', title: 'Create and refine logo designs for the UI brand',
    description: 'Explore visual directions and refine the selected logo concept for the product.',
    columnId: 'review', assigneeIds: ['m1', 'm4'], dueDate: dateOffset(1),
    label: 'Issue', priority: 'Medium',
    checklist: [{ id: 'c8', title: 'Explore logo directions', completed: true }, { id: 'c9', title: 'Prepare final variations', completed: true }, { id: 'c10', title: 'Share for approval', completed: false }],
    attachments: [{ id: 'a2', name: 'brand-exploration.fig', size: '3.4 MB' }],
    coverImage: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=900&q=85',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't6', title: 'Create an icon library for the project',
    description: 'Build a consistent icon set for the main application screens.',
    columnId: 'review', assigneeIds: ['m2', 'm5'], dueDate: dateOffset(4),
    label: 'Feature', priority: 'Low',
    checklist: [{ id: 'c11', title: 'Define icon style', completed: true }, { id: 'c12', title: 'Export icon assets', completed: true }],
    attachments: [], createdAt: new Date().toISOString(),
  },
  {
    id: 't7', title: 'Create the email page layout and necessary components',
    description: 'Finalize the email page and reusable interface components.',
    columnId: 'done', assigneeIds: ['m3', 'm4'], dueDate: dateOffset(-1),
    label: 'Feature', priority: 'Medium',
    checklist: [{ id: 'c13', title: 'Build email layout', completed: true }, { id: 'c14', title: 'Review components', completed: true }],
    attachments: [], createdAt: new Date().toISOString(),
  },
  {
    id: 't8', title: 'Enhance website usability through user feedback',
    description: 'Apply the feedback collected during the usability review.',
    columnId: 'done', assigneeIds: ['m1', 'm2'], dueDate: dateOffset(-2),
    label: 'Feature', priority: 'Low',
    checklist: [], attachments: [],
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't9', title: 'Blog Edit Page Modification and Playlist Page Design',
    description: 'Revisit the page layout and align the components with the updated design system.',
    columnId: 'rework', assigneeIds: ['m2', 'm3'], dueDate: dateOffset(6),
    label: 'Feature', priority: 'High',
    checklist: [{ id: 'c15', title: 'Review feedback', completed: false }],
    attachments: [], coverImage: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=85',
    createdAt: new Date().toISOString(),
  },
];
