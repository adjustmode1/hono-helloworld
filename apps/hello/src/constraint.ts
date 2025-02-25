import { getOrThrow, setupConfiguration } from '@packages/common';

import * as packageMeta from '../package.json';

setupConfiguration();

export const SERVICE_PORT = getOrThrow<number>('service.port');

export const PACKAGE = packageMeta.name;
export const VERSION = packageMeta.version;
