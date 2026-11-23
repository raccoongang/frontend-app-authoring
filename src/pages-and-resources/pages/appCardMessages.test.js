import appCardMessages from './appCardMessages';

describe('appCardMessages', () => {
  // The server sends these texts in English, so a card is translated by its app id: each id needs both messages.
  it.each([
    'progress', 'textbooks', 'calculator', 'proctoring', 'custom_pages', 'ora_settings',
    'live', 'discussion', 'teams', 'edxnotes', 'wiki',
  ])('has a name and a description for %s', (appId) => {
    expect(appCardMessages[`${appId}Name`].defaultMessage).toBeTruthy();
    expect(appCardMessages[`${appId}Description`].defaultMessage).toBeTruthy();
  });

  it('keeps ids unique', () => {
    const ids = Object.values(appCardMessages).map((message) => message.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
