import { Command } from 'commander';
import {
  createScenarioTestCommand,
  ScenarioTestCommandDependencies,
} from './commands/scenario/createScenarioTestCommand';
import { createAiCommand, AiCommandDependencies } from './commands/ai/createAiCommand';

export function createCli(
  command: Command = new Command(),
  scenarioTestCommandDependencies?: ScenarioTestCommandDependencies,
  aiCommandDependencies?: AiCommandDependencies,
): Command {
  return command
    .addCommand(createScenarioTestCommand(scenarioTestCommandDependencies))
    .addCommand(createAiCommand(aiCommandDependencies));
}
