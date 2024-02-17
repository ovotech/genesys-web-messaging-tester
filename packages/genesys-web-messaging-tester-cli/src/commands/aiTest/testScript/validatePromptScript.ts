import { ValidationError } from 'joi';
import { TestPromptFile } from './modelTypes';
import { schema } from './modelSchema';

interface ValidatePromptScriptValidResult {
  validPromptScript: TestPromptFile;
  error?: undefined;
}

interface ValidatePromptScriptInvalidResult {
  validPromptScript?: undefined;
  error: ValidationError;
}

export type ValidatePromptScriptResult =
  | ValidatePromptScriptValidResult
  | ValidatePromptScriptInvalidResult;

export function validatePromptScript(testScript: unknown): ValidatePromptScriptResult {
  const { error, value } = schema.validate(testScript);

  if (error) {
    return { error };
  } else {
    return { validPromptScript: value };
  }
}
