import { containsTerminatingPhrases } from './containsTerminatingPhrases';

test('failure phrase detected', () => {
  const result = containsTerminatingPhrases('This was a failure', ['failure'], ['success']);
  expect(result).toStrictEqual({
    phraseFound: true,
    phraseInSubject: 'failure',
    phraseIndicates: 'fail',
    subject: 'This was a failure',
  });
});

test('success phrase detected', () => {
  const result = containsTerminatingPhrases('This was a success', ['failure'], ['success']);
  expect(result).toStrictEqual({
    phraseFound: true,
    phraseInSubject: 'success',
    phraseIndicates: 'pass',
    subject: 'This was a success',
  });
});

test('neither phrase detected', () => {
  const result = containsTerminatingPhrases('This was inconclusive', ['failure'], ['success']);
  expect(result).toStrictEqual({
    phraseFound: false,
    subject: 'This was inconclusive',
  });
});
