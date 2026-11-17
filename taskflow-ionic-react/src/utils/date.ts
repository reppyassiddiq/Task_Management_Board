export function formatDate(value: string): string {
  if (!value) return 'No date';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short',
  });
}

export function isOverdue(value: string): boolean {
  if (!value) return false;
  const due = new Date(`${value}T23:59:59`);
  return due.getTime() < Date.now();
}
