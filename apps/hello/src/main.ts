import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { getLogger } from '@packages/common';
import { Hono } from 'hono';
import { logger as HonoLogger } from 'hono/logger';
import { openAPISpecs } from 'hono-openapi';
import { OpenAPIV3_1 } from 'openapi-types';

import { PACKAGE, SERVICE_PORT, VERSION } from './constraint';
import HelloController from './modules/hello/hello.controller';
import { ROUTES } from './route';
import ReferenceObject = OpenAPIV3_1.ReferenceObject;
import { getAjvSchema } from './decorator';
import * as SchemaDto from './dtos';
import * as SchemaResponse from './response';

const logger = getLogger('Server');

const SchemasDto: Record<string, ReferenceObject> = Object.keys(
  SchemaDto,
).reduce(
  (acc, key) => {
    acc[key] = getAjvSchema(SchemaDto[key]) as unknown as ReferenceObject;
    return acc;
  },
  {} as Record<string, ReferenceObject>,
);

const SchemasResponse: Record<string, ReferenceObject> = Object.keys(
  SchemaResponse,
).reduce(
  (acc, key) => {
    acc[key] = getAjvSchema(SchemaResponse[key]) as unknown as ReferenceObject;
    return acc;
  },
  {} as Record<string, ReferenceObject>,
);

const app = new Hono();

app.use('*', HonoLogger());
const middleware = swaggerUI({ url: '/openapi' });

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

app.get('/ui', middleware);

app.route(ROUTES.Hello.controller, HelloController);

(() => {
  serve({
    fetch: app.fetch,
    port: SERVICE_PORT,
  });
  logger.info(`${PACKAGE}@${VERSION} started at port ${SERVICE_PORT}`);
  logger.info(`Access Server in http://localhost:${SERVICE_PORT}`);
})();
