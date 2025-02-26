import { getLogger } from '@packages/common';
import { Context, Hono } from 'hono';

import { ROUTES } from '../../route';
import { PostHelloDto, PostHelloSchema, GetHelloSchema } from '../../dtos';
import { ajvValidator } from '../../utils/ajv.validator';
import { describeRoute } from 'hono-openapi';
import { OpenAPIV3_1 } from 'openapi-types';
import ReferenceObject = OpenAPIV3_1.ReferenceObject;

const logger = getLogger('HelloController');

const HelloController = new Hono();

HelloController.get(
  ROUTES.Hello.GetHello,
  ajvValidator('query', GetHelloSchema),
  async (c: Context) => {
    logger.info(ROUTES.Hello.GetHello);

    return c.json({ hello: 'world' });
  },
);

HelloController.post(
  ROUTES.Hello.PostHello,
  ajvValidator('json', PostHelloSchema),
  PostHelloDto,
  async (c: Context) => {
    logger.info(ROUTES.Hello.PostHello);

    return c.json({ hello: 'world' });
  },
);

HelloController.put(ROUTES.Hello.GetHello, PostHelloDto, async (c: Context) => {
  logger.info(ROUTES.Hello.GetHello);

  return c.json({ hello: 'world' });
});

export default HelloController;
