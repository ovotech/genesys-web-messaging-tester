import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

export type YamlFileReader = (path: string) => Record<string, unknown>;

export function createYamlFileReader(fsReadFileSync: typeof readFileSync): YamlFileReader {
  return function (path: string): Record<string, unknown> {
    let content: string;
    try {
      content = fsReadFileSync(path, 'utf8');
    } catch (error) {
      // @ts-ignore
      throw new Error(`Failed to read file '${path}'. Reason: ${error.message}`);
    }

    let yamlContent: unknown;
    try {
      yamlContent = yaml.load(content);
    } catch (error) {
      // @ts-ignore
      throw new Error(`File '${path}' not valid YAML. Reason: ${error.message}`);
    }

    if (
      // https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript#comment25634071_14706877
      yamlContent === Object(yamlContent) &&
      Object.prototype.toString.call(yamlContent) !== '[object Array]'
    ) {
      return yamlContent as Record<string, unknown>;
    } else {
      throw new Error(`File '${path}' must contain YAML`);
    }
  };
}
