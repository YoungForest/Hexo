export function calendarDate(value) {
  if (value instanceof Date) {
    if (Number.isNaN(value.valueOf())) throw new Error('Invalid date');
    return value.toISOString().slice(0,10);
  }
  const m=String(value ?? '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T].*)?$/);
  if (!m) throw new Error('Missing or invalid article date');
  const [y,mo,d]=m.slice(1).map(Number);
  const dt=new Date(Date.UTC(y,mo-1,d));
  if(dt.getUTCFullYear()!==y || dt.getUTCMonth()!==mo-1 || dt.getUTCDate()!==d) throw new Error('Invalid calendar date');
  return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
