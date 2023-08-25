import { Command } from 'commander';
import {
  createScriptedTestCommand,
  ScriptedTestCommandDependencies,
} from './commands/scriptedTest/createScriptedTestCommand';
import {
  createExploratoryTestCommand,
  ExploratoryTestCommandDependencies,
} from './commands/exploratoryTest/createExploratoryTestCommand';

export function createCli(
  command: Command = new Command(),
  scenarioTestCommandDependencies?: ScriptedTestCommandDependencies,
  aiCommandDependencies?: ExploratoryTestCommandDependencies,
): Command {
  return command
    .addCommand(createScriptedTestCommand(scenarioTestCommandDependencies))
    .addCommand(createExploratoryTestCommand(aiCommandDependencies));
}
