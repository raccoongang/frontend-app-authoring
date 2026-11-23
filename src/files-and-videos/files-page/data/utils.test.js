import { parseServerDate } from './utils';

describe('parseServerDate', () => {
  it('reads the English form the CMS sends', () => {
    expect(parseServerDate('Nov 19, 2026 at 14:05 UTC')).toBeInstanceOf(Date);
  });

  it.each([
    ['19 Лист. 2026 14:05 UTC', '2026-11-19T14:05:00.000Z'],
    ['05 Січ. 2026 09:07 UTC', '2026-01-05T09:07:00.000Z'],
    ['05 Квіт. 2026 09:07 UTC', '2026-04-05T09:07:00.000Z'],
    ['05 Травень 2026 09:07 UTC', '2026-05-05T09:07:00.000Z'],
    ['19 листопада 2026 р. о 14:05 UTC', '2026-11-19T14:05:00.000Z'],
  ])('reads the Ukrainian form %s', (value, iso) => {
    expect(parseServerDate(value).toISOString()).toBe(iso);
  });

  it('gives null for text that is not a date, and for nothing', () => {
    expect(parseServerDate('not a date')).toBeNull();
    expect(parseServerDate('')).toBeNull();
  });
});
