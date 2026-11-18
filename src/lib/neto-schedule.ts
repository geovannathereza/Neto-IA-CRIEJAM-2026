import Holidays from 'date-holidays';
const holidays = new Holidays('BR', 'PE', 'RE');
// The bundled calendar still places this state holiday on the first Sunday.
holidays.setHoliday('03-06', { name: 'Data Magna de Pernambuco', type: 'public' });
export function availableSlots(now = new Date()) {
  const local = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Recife', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const day = new Date(local + 'T12:00:00-03:00');
  const hours = [9, 15, 10];
  const result: { iso: string; label: string; long: string }[] = [];
  for (let i = 0; i < 35 && result.length < 3; i++) {
    day.setUTCDate(day.getUTCDate() + 1);
    if ([0, 6].includes(day.getUTCDay()) || holidays.isHoliday(day)) continue;
    const hour = hours[result.length];
    const iso = day.toISOString().slice(0, 10) + `T${String(hour).padStart(2, '0')}:00:00-03:00`;
    const date = new Date(iso);
    const short = date.toLocaleDateString('pt-BR', { timeZone: 'America/Recife', weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '').replace(',', '');
    result.push({ iso, label: `${short.charAt(0).toUpperCase()}${short.slice(1)} · ${hour}h`, long: date.toLocaleDateString('pt-BR', { timeZone: 'America/Recife', weekday: 'long', day: 'numeric', month: 'long' }) + `, às ${hour}h` });
  }
  return result;
}