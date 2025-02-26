import { getLogger } from '@packages/common';
import { Context, Hono } from 'hono';

import { getAjvSchema } from '../../decorator';
import { GetHelloDto, PostHelloDto, PostHelloSchema } from '../../dtos';
import { ROUTES } from '../../route';
import { ajvValidator } from '../../utils/ajv.validator';

const logger = getLogger('HelloController');

const HelloController = new Hono();

HelloController.get(
  ROUTES.Hello.GetHello,
  ajvValidator('query', getAjvSchema(GetHelloDto)),
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
