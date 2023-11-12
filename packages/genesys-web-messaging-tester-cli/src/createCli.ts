import { Command } from 'commander';
import {
  createScriptedTestCommand,
  ScriptedTestCommandDependencies,
} from './commands/scriptedTest/createScriptedTestCommand';
import {
  createAiTestCommand,
  AiTestCommandDependencies,
} from './commands/aiTest/createAiTestCommand';

export function createCli(
  command: Command = new Command(),
  scenarioTestCommandDependencies?: ScriptedTestCommandDependencies,
  aiCommandDependencies?: AiTestCommandDependencies,
): Command {
  return command
    .addCommand(createScriptedTestCommand(scenarioTestCommandDependencies))
    .addCommand(createAiTestCommand(aiCommandDependencies));
}
