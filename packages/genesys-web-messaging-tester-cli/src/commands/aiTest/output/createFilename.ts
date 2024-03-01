const SEPARATOR = '-';

export function sanitise(text: string): string {
  return `${text}`
    .toLowerCase()
    .replace(/\s/g, SEPARATOR)
    .replace(/[^a-z0-9\-_]/gi, '');
}

export function createFilename(scenarioName: string): string {
  return sanitise([scenarioName, Date.now()].filter((e) => e).join(SEPARATOR));
}
