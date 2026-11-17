# TaskFlow — Reppyas Workspace (Ionic React)

A responsive Kanban task management app for the Reppyas workspace, built with Ionic React, TypeScript, and Vite. Data is stored in browser Local Storage; no backend or API is required.

## Requirements
- Node.js 18+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Features
- Five Kanban columns: To Do, Doing, Review, Done, Rework
- Focused Board view toolbar without inactive Timeline, Calendar, or Files tabs
- Create, read, update, and delete tasks
- Drag and drop tasks between columns
- Search by task title and description
- Filter by assignee, label, and due date
- Task detail modal with assignees, deadline, label, priority, and description
- Checklist with automatically calculated progress
- Attachment names and file sizes (demo metadata only)
- Optional cover image URL
- Local Storage persistence
- Export current board to JSON
- Responsive desktop and mobile layouts

## Project structure
```text
src/
├── components/
│   ├── AvatarStack.tsx
│   ├── TaskCard.tsx
│   └── TaskModal.tsx
├── data/
│   └── seed.ts
├── hooks/
│   └── useTasks.ts
├── theme/
│   ├── global.css
│   └── variables.css
├── types/
│   └── task.ts
├── utils/
│   └── date.ts
├── App.tsx
└── main.tsx
```

## Notes
- Attachments are represented by file name and size only. The app does not upload or persist file contents.
- Cover images are loaded from a URL. Use publicly accessible image URLs.
- To reset the demo data, clear the browser's Local Storage key `taskflow.tasks.v1`.


## Workspace branding
The workspace selector is branded as **Reppyas**. The application product name remains **TaskFlow**.

## Motion and interaction polish
- Kanban columns and task cards animate into view on initial render.
- Task cards retain their hover lift and shadow feedback.
- Primary action buttons have hover and pressed-state feedback.
- The task detail panel has a subtle entrance animation.
- Reduced-motion preferences are respected.
