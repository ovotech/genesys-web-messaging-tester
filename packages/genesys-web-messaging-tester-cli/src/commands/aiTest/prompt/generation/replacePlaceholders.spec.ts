import { replacePlaceholders } from './replacePlaceholders';

test('Placeholders are replaced', () => {
  expect(
    replacePlaceholders('{FIRST_NAME} {LAST_NAME} {ABC}', { FIRST_NAME: 'John', LAST_NAME: 'Doe' }),
  ).toStrictEqual('John Doe {ABC}');
});

test('Prompt with missing placeholders are ignored', () => {
  expect(replacePlaceholders('{FIRST_NAME} {LAST_NAME}', { FIRST_NAME: 'John' })).toStrictEqual(
    'John {LAST_NAME}',
  );
});
