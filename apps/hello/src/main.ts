import { serve } from '@hono/node-server';
import { getLogger } from '@packages/common';
import { Hono } from 'hono';
import { logger as HonoLogger } from 'hono/logger';

import { PACKAGE, SERVICE_PORT, VERSION } from './constraint';
import HelloController from './modules/hello/hello.controller';
import { ROUTES } from './route';
import { openAPISpecs } from 'hono-openapi';
import { OpenAPIV3_1 } from 'openapi-types';
import ReferenceObject = OpenAPIV3_1.ReferenceObject;
import * as SchemaDto from './dtos';
import * as SchemaResponse from './response';

const logger = getLogger('Server');

const app = new Hono();

app.use('*', HonoLogger());

(async () => {})();

app.route(ROUTES.Hello.controller, HelloController);

const SchemasDto: Record<string, ReferenceObject> = Object.keys(
  SchemaDto,
).reduce(
  (acc, key) => {
    acc[key] = SchemaDto[key] as ReferenceObject;
    return acc;
  },
  {} as Record<string, ReferenceObject>,
);

const SchemasResponse: Record<string, ReferenceObject> = Object.keys(
  SchemaResponse,
).reduce(
  (acc, key) => {
    acc[key] = SchemaResponse[key] as ReferenceObject;
    return acc;
  },
  {} as Record<string, ReferenceObject>,
);

app.get(
  '/openapi',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'Hono',
        version: '1.0.0',
        description: 'API for greeting users',
      },
      components: {
        schemas: {
          ...SchemasDto,
          ...SchemasResponse,
        },
      },
    },
  }),
);

//
// app.get(
//   '/docs',
//   apiReference({
//     theme: 'saturn',
//     spec: { url: '/openapi' },
//   })
// )

(() => {
  serve({
    fetch: app.fetch,
    port: SERVICE_PORT,
  });
  logger.info(`${PACKAGE}@${VERSION} started at port ${SERVICE_PORT}`);
  logger.info(`Access Server in http://localhost:${SERVICE_PORT}`);
})();
