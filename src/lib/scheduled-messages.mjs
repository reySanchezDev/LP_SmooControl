const timestampWithZone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

export function validateSchedule(schedule) {
  if (schedule?.timeZone !== 'America/Managua' || !Array.isArray(schedule.messages)) {
    throw new Error('Header messages require timeZone America/Managua and a messages array');
  }
  const ids = new Set();
  for (const message of schedule.messages) {
    if (!message || typeof message.id !== 'string' || !message.id.trim() || ids.has(message.id)) {
      throw new Error('Each header message requires a unique, nonempty id');
    }
    ids.add(message.id);
    if (typeof message.text !== 'string' || !message.text.trim()) {
      throw new Error(`${message.id}: text is required`);
    }
    for (const field of ['startsAt', 'endsAt']) {
      const value = message[field];
      const calendarTime = typeof value === 'string' ? Date.parse(`${value.slice(0, 19)}Z`) : NaN;
      if (!timestampWithZone.test(value) || !Number.isFinite(Date.parse(value))
        || !Number.isFinite(calendarTime) || new Date(calendarTime).toISOString().slice(0, 19) !== value.slice(0, 19)) {
        throw new Error(`${message.id}: ${field} requires a full ISO date with an explicit timezone offset`);
      }
    }
    if (Date.parse(message.endsAt) <= Date.parse(message.startsAt)) {
      throw new Error(`${message.id}: endsAt must be later than startsAt`);
    }
    if (message.priority !== undefined && !Number.isFinite(message.priority)) {
      throw new Error(`${message.id}: priority must be a number`);
    }
    if (message.enabled !== undefined && typeof message.enabled !== 'boolean') {
      throw new Error(`${message.id}: enabled must be true or false`);
    }
  }
  return schedule;
}

export function activeMessage(schedule, now = Date.now()) {
  return schedule.messages
    .filter(message => message.enabled !== false && Date.parse(message.startsAt) <= now && now < Date.parse(message.endsAt))
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)
      || Date.parse(b.startsAt) - Date.parse(a.startsAt)
      || a.id.localeCompare(b.id))[0] ?? null;
}

export function nextMessageBoundary(schedule, now = Date.now()) {
  const boundaries = schedule.messages
    .filter(message => message.enabled !== false)
    .flatMap(message => [Date.parse(message.startsAt), Date.parse(message.endsAt)])
    .filter(time => time > now);
  return boundaries.length ? Math.min(...boundaries) : null;
}
