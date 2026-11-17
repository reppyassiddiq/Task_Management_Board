import { IonIcon } from '@ionic/react';
import { calendarOutline, chatbubbleEllipsesOutline, checkmarkCircleOutline, attachOutline } from 'ionicons/icons';
import type { Task, TeamMember } from '../types/task';
import { formatDate, isOverdue } from '../utils/date';
import AvatarStack from './AvatarStack';

interface Props {
  task: Task;
  members: TeamMember[];
  onOpen: (task: Task) => void;
  onDragStart: (event: React.DragEvent, taskId: string) => void;
}

export default function TaskCard({ task, members, onOpen, onDragStart }: Props) {
  const completed = task.checklist.filter((item) => item.completed).length;
  const total = task.checklist.length;

  return (
    <article
      className="task-card"
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
      onClick={() => onOpen(task)}
      onKeyDown={(event) => event.key === 'Enter' && onOpen(task)}
      role="button"
      tabIndex={0}
      aria-label={`Open task ${task.title}`}
    >
      {task.coverImage && <img className="task-cover" src={task.coverImage} alt="" />}
      <div className="task-card-body">
        <div className="task-card-top">
          <span className={`task-label label-${task.label.toLowerCase()}`}>{task.label}</span>
          {task.priority === 'High' && <span className="priority-dot" title="High priority" />}
        </div>
        <h3>{task.title}</h3>
        {task.description && <p className="task-excerpt">{task.description}</p>}
        <div className="task-meta">
          <span className={`date-chip ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
            <IonIcon icon={calendarOutline} /> {formatDate(task.dueDate)}
          </span>
          <div className="task-stats">
            {total > 0 && <span title="Checklist"><IonIcon icon={checkmarkCircleOutline} /> {completed}/{total}</span>}
            {task.attachments.length > 0 && <span title="Attachments"><IonIcon icon={attachOutline} /> {task.attachments.length}</span>}
            <span title="Activity"><IonIcon icon={chatbubbleEllipsesOutline} /> {task.id === 't1' ? 43 : task.id === 't5' ? 52 : 14}</span>
          </div>
        </div>
        <div className="task-card-footer">
          <AvatarStack members={members} memberIds={task.assigneeIds} />
        </div>
      </div>
    </article>
  );
}
