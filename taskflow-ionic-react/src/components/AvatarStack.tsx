import { IonAvatar } from '@ionic/react';
import type { TeamMember } from '../types/task';

interface Props {
  members: TeamMember[];
  memberIds: string[];
  limit?: number;
}

export default function AvatarStack({ members, memberIds, limit = 3 }: Props) {
  const assigned = memberIds.map((id) => members.find((member) => member.id === id)).filter(Boolean) as TeamMember[];
  const visible = assigned.slice(0, limit);

  return (
    <div className="avatar-stack" aria-label="Assigned team members">
      {visible.map((member) => (
        <IonAvatar key={member.id} className="member-avatar" title={member.name}>
          <div style={{ background: member.color }}>{member.initials}</div>
        </IonAvatar>
      ))}
      {assigned.length > limit && <span className="avatar-extra">+{assigned.length - limit}</span>}
      {assigned.length === 0 && <span className="unassigned">Unassigned</span>}
    </div>
  );
}
