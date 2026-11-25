import { readFile } from 'node:fs/promises';
import { validateSchedule } from '../src/lib/scheduled-messages.mjs';

const schedule = JSON.parse(await readFile(new URL('../public/header-messages.json', import.meta.url), 'utf8'));
validateSchedule(schedule);
console.log(`Header message schedule validated: ${schedule.messages.length} messages`);
