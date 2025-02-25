import { getLogger } from '@packages/common';
import { Context, Hono } from 'hono';

import { GetHelloDto } from '../../dtos/get-hello.dto';
import { ROUTES } from '../../route';

const logger = getLogger('HelloController');

const HelloController = new Hono();

HelloController.get(ROUTES.Hello.GetHello, GetHelloDto, async (c: Context) => {
  logger.info(ROUTES.Hello.GetHello);

  return c.json({ hello: 'world' });
});

// HelloController.get(ROUTES.Hello.ListHello, async (c: Context) => {
//   logger.info(ROUTES.Hello.ListHello);
//
//   return c.json({ hello: [] });
// });
//
// HelloController.post(ROUTES.Hello.PostHello, async (c: Context) => {
//   logger.info(ROUTES.Hello.PostHello);
//
//   return c.json({ hello: [] });
// });
//
// HelloController.post(ROUTES.Hello.DeletesHello, async (c: Context) => {
//   logger.info(ROUTES.Hello.DeletesHello);
//
//   return c.json({ hello: [] });
// });

export default HelloController;
