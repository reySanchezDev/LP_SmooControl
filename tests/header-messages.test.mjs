import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { activeMessage, nextMessageBoundary, validateSchedule } from '../src/lib/scheduled-messages.mjs';

const published = JSON.parse(await readFile(new URL('../public/header-messages.json', import.meta.url), 'utf8'));
// Historical fixture: future campaigns may remove Jasmine from the live schedule.
const message = {
  id: 'jasmine-nicaragua-2026-11-24',
  text: '¡Vamos, Jasmine! La Sazón de Sheyla está con vos. ¡Brillá, Nicaragua!',
  startsAt: '2026-11-24T00:00:00-06:00',
  endsAt: '2026-11-25T00:00:00-06:00',
  priority: 10,
  enabled: true,
};
const schedule = { timeZone: 'America/Managua', messages: [message] };

test('published schedule and historical fixture are valid', () => {
  assert.equal(validateSchedule(schedule), schedule);
  assert.equal(validateSchedule(published), published);
});

test('today in Nicaragua starts at 06:00 UTC regardless of visitor timezone', () => {
  assert.equal(activeMessage(schedule, Date.parse('2026-11-24T05:59:59.999Z')), null);
  assert.equal(activeMessage(schedule, Date.parse('2026-11-24T06:00:00Z')).id, message.id);
});

test('message remains active until the last millisecond before Nicaragua midnight', () => {
  assert.equal(activeMessage(schedule, Date.parse('2026-11-25T05:59:59.999Z')).id, message.id);
  assert.equal(activeMessage(schedule, Date.parse('2026-11-25T06:00:00Z')), null);
  assert.equal(activeMessage(schedule, Date.parse('2026-11-26T12:00:00Z')), null);
});

test('next timer targets the precise start or expiration boundary', () => {
  assert.equal(nextMessageBoundary(schedule, Date.parse('2026-11-24T05:59:59Z')), Date.parse(message.startsAt));
  assert.equal(nextMessageBoundary(schedule, Date.parse('2026-11-25T05:59:59Z')), Date.parse(message.endsAt));
  assert.equal(nextMessageBoundary(schedule, Date.parse(message.endsAt)), null);
});

test('disabled messages do not appear or schedule boundaries', () => {
  const disabled = { ...schedule, messages: [{ ...message, enabled: false }] };
  assert.equal(activeMessage(disabled, Date.parse(message.startsAt)), null);
  assert.equal(nextMessageBoundary(disabled, Date.parse(message.startsAt)), null);
});

test('overlapping messages choose priority, then most recent start, without reordering the input', () => {
  const other = { ...message, id: 'other', priority: 20 };
  const overlapping = { ...schedule, messages: [message, other] };
  assert.equal(activeMessage(overlapping, Date.parse(message.startsAt)).id, 'other');
  assert.deepEqual(overlapping.messages.map(item => item.id), [message.id, other.id]);
  const later = { ...other, priority: message.priority, startsAt: '2026-11-24T12:00:00-06:00' };
  assert.equal(activeMessage({ ...schedule, messages: [message, later] }, Date.parse(later.startsAt)).id, 'other');
});

test('empty schedules hide the banner', () => {
  const empty = { timeZone: 'America/Managua', messages: [] };
  validateSchedule(empty);
  assert.equal(activeMessage(empty), null);
});

test('invalid schedules are rejected before deployment', () => {
  for (const invalid of [
    { ...message, startsAt: '2026-11-24T00:00:00' },
    { ...message, endsAt: message.startsAt },
    { ...message, endsAt: 'not-a-date' },
    { ...message, startsAt: '2026-02-30T00:00:00-06:00' },
    { ...message, startsAt: '2026-11-24T24:00:00-06:00' },
    { ...message, text: '' },
    { ...message, enabled: 'false' },
    { ...message, priority: 'high' },
  ]) assert.throws(() => validateSchedule({ ...schedule, messages: [invalid] }));
  assert.throws(() => validateSchedule({ ...schedule, messages: [message, message] }));
});
