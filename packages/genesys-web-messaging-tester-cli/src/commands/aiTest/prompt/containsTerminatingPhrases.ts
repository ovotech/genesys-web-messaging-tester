export interface PhraseFound {
  phraseFound: true;
  phraseIndicates: 'fail' | 'pass';
  phraseInSubject: string;
  subject: string;
}

export interface PhraseNotFound {
  phraseFound: false;
  subject: string;
}

export type PhraseFoundResult = PhraseFound | PhraseNotFound;

export function containsTerminatingPhrases(
  subject: string,
  phrases: { fail: string[]; pass: string[] },
): PhraseFoundResult {
  const failurePhraseFound = phrases.fail.find((phrase) =>
    subject.toUpperCase().includes(phrase.toUpperCase()),
  );
  if (failurePhraseFound) {
    return {
      phraseFound: true,
      phraseIndicates: 'fail',
      phraseInSubject: failurePhraseFound,
      subject,
    };
  }

  const passPhraseFound = phrases.pass.find((phrase) =>
    subject.toUpperCase().includes(phrase.toUpperCase()),
  );
  if (passPhraseFound) {
    return {
      phraseFound: true,
      phraseIndicates: 'pass',
      phraseInSubject: passPhraseFound,
      subject,
    };
  }

  return {
    phraseFound: false,
    subject,
  };
}
