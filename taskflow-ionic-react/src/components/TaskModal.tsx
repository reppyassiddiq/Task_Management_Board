import { useEffect, useMemo, useState } from 'react';
import {
  IonButton, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonSelect,
  IonSelectOption, IonTextarea,
} from '@ionic/react';
import {
  addOutline, attachOutline, calendarOutline, checkmarkDoneOutline,
  closeOutline, imageOutline, trashOutline,
} from 'ionicons/icons';
import type { BoardColumn, ChecklistItem, Task, TaskLabel, Priority, TeamMember } from '../types/task';
import AvatarStack from './AvatarStack';
import { formatDate } from '../utils/date';

interface Props {
  isOpen: boolean;
  task: Task | null;
  columns: BoardColumn[];
  members: TeamMember[];
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToast: (message: string) => void;
}

const createId = () => Math.random().toString(36).slice(2, 10);

export default function TaskModal({ isOpen, task, columns, members, onClose, onSave, onDelete, onToast }: Props) {
  const [draft, setDraft] = useState<Task | null>(task);
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    setDraft(task);
    setNewSubtask('');
  }, [task, isOpen]);

  const completed = useMemo(() => draft?.checklist.filter((item) => item.completed).length ?? 0, [draft]);
  const total = draft?.checklist.length ?? 0;
  const progress = total ? (completed / total) * 100 : 0;

  if (!draft) return null;

  const update = <K extends keyof Task>(key: K, value: Task[K]) => {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  };

  const toggleAssignee = (memberId: string) => {
    const selected = draft.assigneeIds.includes(memberId)
      ? draft.assigneeIds.filter((id) => id !== memberId)
      : [...draft.assigneeIds, memberId];
    update('assigneeIds', selected);
  };

  const addChecklistItem = () => {
    if (!newSubtask.trim()) return;
    const item: ChecklistItem = { id: createId(), title: newSubtask.trim(), completed: false };
    update('checklist', [...draft.checklist, item]);
    setNewSubtask('');
  };

  const toggleChecklistItem = (id: string) => {
    update('checklist', draft.checklist.map((item) => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const removeChecklistItem = (id: string) => {
    update('checklist', draft.checklist.filter((item) => item.id !== id));
  };

  const addFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;
    const additions = selected.map((file) => ({ id: createId(), name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` }));
    update('attachments', [...draft.attachments, ...additions]);
    onToast(`${selected.length} attachment added`);
    event.target.value = '';
  };

  const save = () => {
    if (!draft.title.trim()) {
      onToast('Task title is required');
      return;
    }
    onSave({ ...draft, title: draft.title.trim() });
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="task-modal">
      <div className="detail-shell">
        <header className="detail-topbar">
          <div className="detail-breadcrumb"><span>Workspace</span><span>/</span><strong>Project board</strong><span>/</span><span>Task detail</span></div>
          <IonButton fill="clear" color="medium" onClick={onClose} aria-label="Close detail"><IonIcon icon={closeOutline} /></IonButton>
        </header>

        <div className="detail-layout">
          <section className="detail-main">
            <div className="detail-action-row">
              <span className="complete-indicator"><IonIcon icon={checkmarkDoneOutline} /> Task details</span>
              <span className="task-id">TASK-{draft.id.slice(-4).toUpperCase()}</span>
            </div>

            <div className="cover-editor">
              {draft.coverImage ? (
                <div className="cover-preview">
                  <img src={draft.coverImage} alt="Task cover" />
                  <button className="cover-remove" onClick={() => update('coverImage', undefined)}>Remove cover</button>
                </div>
              ) : (
                <label className="cover-placeholder">
                  <IonIcon icon={imageOutline} />
                  <span>Add cover image URL</span>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    defaultValue=""
                    onBlur={(event) => {
                      const url = event.currentTarget.value.trim();
                      if (url) update('coverImage', url);
                    }}
                    aria-label="Cover image URL"
                  />
                </label>
              )}
            </div>

            <div className="detail-title-wrap">
              <label className="detail-field-label" htmlFor="task-title">Task title <span>*</span></label>
              <input
                id="task-title"
                className="detail-title-input"
                type="text"
                value={draft.title}
                placeholder="Enter task title..."
                onChange={(event) => update('title', event.target.value)}
                aria-label="Task title"
                autoComplete="off"
              />
              <span className="detail-subtitle">Keep your team aligned with clear task ownership and deadlines.</span>
            </div>

            <div className="detail-fields">
              <div className="field-block">
                <label>Assignee</label>
                <div className="assignee-picker">
                  <AvatarStack members={members} memberIds={draft.assigneeIds} limit={5} />
                  <div className="assignee-options">
                    {members.map((member) => (
                      <button key={member.id} className={`assignee-option ${draft.assigneeIds.includes(member.id) ? 'selected' : ''}`} onClick={() => toggleAssignee(member.id)} title={member.name}>
                        <span style={{ background: member.color }}>{member.initials}</span>{member.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="field-block">
                <label htmlFor="due-date">Due date</label>
                <div className="date-input-wrap"><IonIcon icon={calendarOutline} /><input id="due-date" type="date" value={draft.dueDate} onChange={(event) => update('dueDate', event.target.value)} /></div>
              </div>
              <div className="field-block">
                <label>Board</label>
                <IonItem lines="none" className="select-field"><IonSelect value="main" interface="popover" disabled><IonSelectOption value="main">Product Launch</IonSelectOption></IonSelect></IonItem>
              </div>
              <div className="field-block">
                <label>Column</label>
                <IonItem lines="none" className="select-field"><IonSelect value={draft.columnId} interface="popover" onIonChange={(event) => update('columnId', event.detail.value)}>{columns.map((column) => <IonSelectOption key={column.id} value={column.id}>{column.title}</IonSelectOption>)}</IonSelect></IonItem>
              </div>
              <div className="field-block">
                <label>Label</label>
                <IonItem lines="none" className="select-field"><IonSelect value={draft.label} interface="popover" onIonChange={(event) => update('label', event.detail.value as TaskLabel)}>{(['Feature', 'Bug', 'Issue', 'Undefined'] as TaskLabel[]).map((label) => <IonSelectOption key={label} value={label}>{label}</IonSelectOption>)}</IonSelect></IonItem>
              </div>
              <div className="field-block">
                <label>Priority</label>
                <IonItem lines="none" className="select-field"><IonSelect value={draft.priority} interface="popover" onIonChange={(event) => update('priority', event.detail.value as Priority)}>{(['Low', 'Medium', 'High'] as Priority[]).map((priority) => <IonSelectOption key={priority} value={priority}>{priority}</IonSelectOption>)}</IonSelect></IonItem>
              </div>
            </div>

            <div className="detail-section">
              <h3>Description</h3>
              <IonTextarea className="description-input" autoGrow value={draft.description} placeholder="Add a description..." onIonInput={(event) => update('description', event.detail.value ?? '')} />
            </div>
          </section>

          <aside className="detail-sidebar">
            <section className="detail-section">
              <h3>Attachments <span className="section-count">{draft.attachments.length}</span></h3>
              <label className="attachment-dropzone">
                <IonIcon icon={attachOutline} />
                <span><strong>Click to upload</strong> or browse from device</span>
                <input type="file" multiple onChange={addFiles} />
              </label>
              {draft.attachments.length > 0 && (
                <div className="attachment-list">
                  {draft.attachments.map((file) => (
                    <div className="attachment-item" key={file.id}>
                      <div className="file-icon">FILE</div>
                      <div className="file-info"><strong>{file.name}</strong><span>{file.size}</span></div>
                      <button onClick={() => update('attachments', draft.attachments.filter((item) => item.id !== file.id))} aria-label={`Remove ${file.name}`}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="detail-section checklist-section">
              <div className="section-heading-row"><h3>Check List</h3><span className="checklist-count">{completed}/{total}</span></div>
              <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
              <div className="checklist-items">
                {draft.checklist.map((item) => (
                  <div className="checklist-item" key={item.id}>
                    <button className={`check-button ${item.completed ? 'checked' : ''}`} onClick={() => toggleChecklistItem(item.id)} aria-label="Toggle checklist item">{item.completed ? '✓' : ''}</button>
                    <span className={item.completed ? 'is-complete' : ''}>{item.title}</span>
                    <button className="remove-subtask" onClick={() => removeChecklistItem(item.id)} aria-label="Remove subtask">×</button>
                  </div>
                ))}
              </div>
              <form className="add-subtask" onSubmit={(event) => { event.preventDefault(); addChecklistItem(); }}>
                <input value={newSubtask} onChange={(event) => setNewSubtask(event.target.value)} placeholder="Add subtask..." aria-label="New subtask" />
                <button type="submit" aria-label="Add subtask"><IonIcon icon={addOutline} /></button>
              </form>
            </section>

            <section className="detail-section activity-section">
              <h3>Activity</h3>
              <div className="activity-empty"><span className="activity-dot" /> Task details were last updated just now</div>
            </section>

            <div className="detail-footer">
              <IonButton fill="clear" color="medium" onClick={onClose}>Discard</IonButton>
              <IonButton className="save-button" onClick={save}>Save changes</IonButton>
            </div>
            <button className="delete-task-button" onClick={() => { onDelete(draft.id); onClose(); }}> <IonIcon icon={trashOutline} /> Delete task</button>
          </aside>
        </div>
      </div>
    </IonModal>
  );
}
