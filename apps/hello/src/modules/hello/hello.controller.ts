import { getLogger } from '@packages/common';
import { Context, Hono } from 'hono';

import { getAjvSchema } from '../../decorator';
import { GetHelloDto, PostHelloDto } from '../../dtos';
import { ROUTES } from '../../route';
import { ajvValidator } from '../../utils/ajv.validator';
import {PutHelloDto} from "../../dtos/put-hello.dto";

const logger = getLogger('HelloController');

const HelloController = new Hono();

// HelloController.get(
//   ROUTES.Hello.GetHello,
//   ajvValidator('query', getAjvSchema(GetHelloDto)),
//   async (c: Context) => {
//     logger.info(ROUTES.Hello.GetHello);
//
//     return c.json({ hello: 'world' });
//   },
// );

HelloController.post(
  ROUTES.Hello.PostHello,
  ajvValidator('json', getAjvSchema(PostHelloDto)),
  async (c: Context) => {
    logger.info(ROUTES.Hello.PostHello);

    return c.json({ hello: 'world' });
  },
);

// HelloController.put(ROUTES.Hello.PutHello, ajvValidator('json', getAjvSchema(PutHelloDto)), async (c: Context) => {
//   logger.info(ROUTES.Hello.GetHello);
//
//   return c.json({ hello: 'world' });
// });

export default HelloController;
