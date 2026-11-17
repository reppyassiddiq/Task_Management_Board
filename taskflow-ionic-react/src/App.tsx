import { useMemo, useState } from 'react';
import {
  IonApp, IonButton, IonContent, IonIcon, IonInput,
  IonSelect, IonSelectOption, IonToast,
} from '@ionic/react';
import {
  addOutline, chevronDownOutline, filterOutline, searchOutline,
  downloadOutline, ellipsisHorizontal,
  peopleOutline, layersOutline, closeCircleOutline,
} from 'ionicons/icons';
import { columns, members } from './data/seed';
import { useTasks } from './hooks/useTasks';
import type { Task, TaskLabel } from './types/task';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';

const createId = () => `t${Date.now().toString(36)}`;

function App() {
  const { tasks, setTasks } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [labelFilter, setLabelFilter] = useState('all');
  const [dueFilter, setDueFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const query = search.toLowerCase().trim();
    const matchesSearch = !query || `${task.title} ${task.description}`.toLowerCase().includes(query);
    const matchesAssignee = assigneeFilter === 'all' || task.assigneeIds.includes(assigneeFilter);
    const matchesLabel = labelFilter === 'all' || task.label === labelFilter;
    const matchesDue = dueFilter === 'all'
      || (dueFilter === 'overdue' && task.dueDate && new Date(`${task.dueDate}T23:59:59`).getTime() < Date.now())
      || (dueFilter === 'upcoming' && task.dueDate && new Date(`${task.dueDate}T00:00:00`).getTime() >= new Date().setHours(0, 0, 0, 0));
    return matchesSearch && matchesAssignee && matchesLabel && matchesDue;
  }), [tasks, search, assigneeFilter, labelFilter, dueFilter]);

  const activeFilters = [assigneeFilter !== 'all', labelFilter !== 'all', dueFilter !== 'all'].filter(Boolean).length;

  const openNewTask = (columnId: string) => {
    const freshTask: Task = {
      id: createId(), title: '', description: '', columnId, assigneeIds: [],
      dueDate: new Date().toISOString().slice(0, 10), label: 'Feature',
      priority: 'Medium', checklist: [], attachments: [], createdAt: new Date().toISOString(),
    };
    setActiveTask(freshTask);
    setModalOpen(true);
  };

  const saveTask = (updatedTask: Task) => {
    setTasks((current) => {
      const exists = current.some((task) => task.id === updatedTask.id);
      return exists ? current.map((task) => task.id === updatedTask.id ? updatedTask : task) : [updatedTask, ...current];
    });
    setToast(tasks.some((task) => task.id === updatedTask.id) ? 'Task updated successfully' : 'Task created successfully');
  };

  const deleteTask = (taskId: string) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
    setToast('Task deleted successfully');
  };

  const moveTask = (columnId: string) => {
    if (!draggedTaskId) return;
    setTasks((current) => current.map((task) => task.id === draggedTaskId ? { ...task, columnId } : task));
    setDraggedTaskId(null);
    setToast('Task moved to new column');
  };

  const exportTasks = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'taskflow-board.json';
    link.click();
    URL.revokeObjectURL(url);
    setToast('Board exported as JSON');
  };

  const resetFilters = () => {
    setAssigneeFilter('all');
    setLabelFilter('all');
    setDueFilter('all');
    setSearch('');
  };

  return (
    <IonApp>
      <IonContent fullscreen className="app-content">
        <main className="workspace">
          <header className="topbar">
            <div className="brand-lockup">
              <div className="brand-mark"><LayersIcon /></div>
              <div><strong>taskflow</strong><span>WORKSPACE</span></div>
            </div>
            <div className="workspace-switcher">
              <span className="workspace-avatar">R</span>
              <span>Reppyas</span>
              <IonIcon icon={chevronDownOutline} />
            </div>
            <div className="topbar-spacer" />
            <div className="team-presence">
              {members.slice(0, 4).map((member) => <span key={member.id} className="presence-avatar" style={{ background: member.color }}>{member.initials}</span>)}
              <span className="presence-more">+2</span>
            </div>
            <button className="invite-button" onClick={() => setToast('Invite link copied (demo)')}><IonIcon icon={peopleOutline} /> Invite</button>
            <div className="topbar-divider" />
            <button className={`toolbar-action ${filterOpen ? 'active' : ''}`} onClick={() => setFilterOpen(!filterOpen)}><IonIcon icon={filterOutline} /> Filter {activeFilters > 0 && <span className="filter-count">{activeFilters}</span>}</button>
            <button className="toolbar-action" onClick={exportTasks}><IonIcon icon={downloadOutline} /> Export</button>
          </header>

          <section className="board-heading">
            <div>
              <div className="eyebrow">OVERVIEW / PROJECTS</div>
              <div className="board-title-row"><h1>Product Launch</h1><span className="private-badge"><span /> Private board</span></div>
              <p className="board-subtitle">Plan, organize, and track your team's work in one place.</p>
            </div>
            <div className="board-heading-right">
              <div className="search-box">
                <IonIcon icon={searchOutline} />
                <IonInput value={search} placeholder="Search tasks..." onIonInput={(event) => setSearch(event.detail.value ?? '')} />
                {search && <button onClick={() => setSearch('')} aria-label="Clear search"><IonIcon icon={closeCircleOutline} /></button>}
              </div>
              <IonButton className="add-task-button" onClick={() => openNewTask('todo')}><IonIcon icon={addOutline} slot="start" /> Add task</IonButton>
            </div>
          </section>

          {filterOpen && (
            <section className="filter-panel">
              <div className="filter-panel-title"><strong>Filter tasks</strong><span>Refine your board view</span></div>
              <label>Assignee
                <IonSelect interface="popover" value={assigneeFilter} onIonChange={(event) => setAssigneeFilter(event.detail.value)}>
                  <IonSelectOption value="all">All members</IonSelectOption>
                  {members.map((member) => <IonSelectOption key={member.id} value={member.id}>{member.name}</IonSelectOption>)}
                </IonSelect>
              </label>
              <label>Label
                <IonSelect interface="popover" value={labelFilter} onIonChange={(event) => setLabelFilter(event.detail.value)}>
                  <IonSelectOption value="all">All labels</IonSelectOption>
                  {(['Feature', 'Bug', 'Issue', 'Undefined'] as TaskLabel[]).map((label) => <IonSelectOption key={label} value={label}>{label}</IonSelectOption>)}
                </IonSelect>
              </label>
              <label>Due date
                <IonSelect interface="popover" value={dueFilter} onIonChange={(event) => setDueFilter(event.detail.value)}>
                  <IonSelectOption value="all">Any date</IonSelectOption>
                  <IonSelectOption value="upcoming">Upcoming</IonSelectOption>
                  <IonSelectOption value="overdue">Overdue</IonSelectOption>
                </IonSelect>
              </label>
              <button className="clear-filters" onClick={resetFilters}>Clear all</button>
            </section>
          )}

          <section className="board-toolbar" aria-label="Board overview">
            <div className="board-view-label">
              <span className="board-view-icon"><IonIcon icon={layersOutline} /></span>
              <div className="board-view-copy">
                <strong>Board view</strong>
                <span>{columns.length} columns <span className="meta-separator">·</span> {filteredTasks.length} tasks shown</span>
              </div>
            </div>
            <div className="board-toolbar-right">
              <span><span className="live-dot" /> All changes saved</span>
            </div>
          </section>

          <section className="kanban-board" aria-label="Kanban board">
            {columns.map((column) => {
              const columnTasks = filteredTasks.filter((task) => task.columnId === column.id);
              return (
                <section
                  className={`kanban-column ${draggedTaskId ? 'drop-ready' : ''}`}
                  key={column.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => { event.preventDefault(); moveTask(column.id); }}
                >
                  <div className="column-header">
                    <div className="column-title-wrap"><span className={`column-indicator indicator-${column.id}`} /><h2>{column.title}</h2><span className="column-count">{columnTasks.length}</span></div>
                    <div className="column-actions"><button onClick={() => openNewTask(column.id)} aria-label={`Add task to ${column.title}`}><IonIcon icon={addOutline} /></button><button onClick={() => setToast(`${column.title} options`)} aria-label="Column options"><IonIcon icon={ellipsisHorizontal} /></button></div>
                  </div>
                  <div className="column-cards">
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        members={members}
                        onOpen={(selected) => { setActiveTask(selected); setModalOpen(true); }}
                        onDragStart={(event, id) => { setDraggedTaskId(id); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', id); }}
                      />
                    ))}
                    {columnTasks.length === 0 && <div className="empty-column">No tasks here yet</div>}
                    <button className="add-card-inline" onClick={() => openNewTask(column.id)}><IonIcon icon={addOutline} /> Add task</button>
                  </div>
                </section>
              );
            })}
          </section>

          <footer className="workspace-footer"><span>© 2025 TaskFlow Workspace</span><span><span className="footer-status" /> Your workspace is up to date</span></footer>
        </main>
      </IonContent>

      <TaskModal
        isOpen={modalOpen}
        task={activeTask}
        columns={columns}
        members={members}
        onClose={() => setModalOpen(false)}
        onSave={saveTask}
        onDelete={deleteTask}
        onToast={setToast}
      />
      <IonToast isOpen={Boolean(toast)} message={toast} duration={2200} position="bottom" onDidDismiss={() => setToast('')} />
    </IonApp>
  );
}

function LayersIcon() {
  return <IonIcon icon={layersOutline} />;
}

export default App;
