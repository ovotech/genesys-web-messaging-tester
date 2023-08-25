import { Command } from 'commander';
import {
  createScenarioTestCommand,
  ScenarioTestCommandDependencies,
} from './commands/scenario/createScenarioTestCommand';
import {
  createExploreCommand,
  ExploreCommandDependencies,
} from './commands/explore/createExploreCommand';

export function createCli(
  command: Command = new Command(),
  scenarioTestCommandDependencies?: ScenarioTestCommandDependencies,
  aiCommandDependencies?: ExploreCommandDependencies,
): Command {
  return command
    .addCommand(createScenarioTestCommand(scenarioTestCommandDependencies))
    .addCommand(createExploreCommand(aiCommandDependencies));
}
