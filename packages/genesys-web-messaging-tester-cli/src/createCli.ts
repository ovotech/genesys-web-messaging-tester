import { Command } from 'commander';
import {
  createScenarioTestCommand,
  ScenarioTestCommandDependencies,
} from './scenarioCommand/createScenarioTestCommand';

export function createCli(
  command: Command = new Command(),
  scenarioTestCommandDependencies?: ScenarioTestCommandDependencies,
): Command {
  return command.addCommand(createScenarioTestCommand(scenarioTestCommandDependencies));
}
