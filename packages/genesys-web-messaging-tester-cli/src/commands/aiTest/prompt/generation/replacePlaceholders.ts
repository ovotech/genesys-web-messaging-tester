export function replacePlaceholders(
  prompt: string,
  placeholderValues: Record<string, string>,
): string {
  return Object.entries(placeholderValues).reduce(
    (previousValue, [placeholderKey, placeholderValue]) => {
      return previousValue.replace(`{${placeholderKey}}`, placeholderValue);
    },
    prompt,
  );
}
