import { serve } from '@hono/node-server';
import { getLogger } from '@packages/common';
import { Hono } from 'hono';
import { logger as HonoLogger } from 'hono/logger';
import { openAPISpecs } from 'hono-openapi';

import { PACKAGE, SERVICE_PORT, VERSION } from './constraint';
import HelloController from './modules/hello/hello.controller';
import { ROUTES } from './route';

const logger = getLogger('Server');

const app = new Hono();

app.use('*', HonoLogger());

(async () => {})();

app.route(ROUTES.Hello.controller, HelloController);

app.get(
  '/openapi',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'Hono API',
        version: '1.0.0',
        description: 'Greeting API',
      },
      servers: [{ url: 'http://localhost:3000', description: 'Local Server' }],
    },
  }),
);

(() => {
  serve({
    fetch: app.fetch,
    port: SERVICE_PORT,
  });
  logger.info(`${PACKAGE}@${VERSION} started at port ${SERVICE_PORT}`);
  logger.info(`Access Server in http://localhost:${SERVICE_PORT}`);
})();
