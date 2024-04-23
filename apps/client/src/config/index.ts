import { existsSync, readFileSync } from 'fs';
import { UserConfigOptions } from '.';
import { logger } from '@rhidium/core';

const configFileExists = existsSync('./config/config.json');

if (
  !configFileExists
  && process.env.CI !== 'true'
  && process.env.DRY_RUN !== 'true'
) {
  logger._warn([
    './config/config.json does not exist, did you forget to create it?',
    'You can use our web-based editor to create a new one',
    'and configure it: `pnpm config-editor` - you can build',
    'your bot in DRY_RUN mode without needing a config file.',
  ].join(' '));
  process.exit(1);
}

const configData = configFileExists
  ? readFileSync('./config/config.json', 'utf8')
  : readFileSync('./config/config.example.json', 'utf8');
const userConfig = JSON.parse(configData) as UserConfigOptions;

export default userConfig;

export * from './internal-config';
export * from './types';
