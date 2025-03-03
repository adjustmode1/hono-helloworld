import { getLogger } from '@packages/common';
import { Context, Hono } from 'hono';

import { getAjvSchema } from '../../decorator';
import {
  ArrayCaseDto,
  CaseRangeDto,
  GetHelloDto,
  PostHelloDto,
} from '../../dtos';
import { PutHelloDto } from '../../dtos';
import { CaseEmojiDto } from '../../dtos';
import { CaseUuidDto } from '../../dtos/case-uuid.dto';
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
  ajvValidator('json', getAjvSchema(PostHelloDto)),
  async (c: Context) => {
    logger.info(ROUTES.Hello.PostHello);

    return c.json({ hello: 'world' });
  },
);

HelloController.put(
  ROUTES.Hello.PutHello,
  ajvValidator('json', getAjvSchema(PutHelloDto)),
  async (c: Context) => {
    logger.info(ROUTES.Hello.GetHello);

    return c.json({ hello: 'world' });
  },
);

// Case Range
HelloController.post(
  ROUTES.Hello.CaseRange,
  ajvValidator('json', getAjvSchema(CaseRangeDto)),
  async (c: Context) => {
    logger.info(ROUTES.Hello.CaseRange);

    return c.json({ hello: 'world' });
  },
);

// Case Array
HelloController.post(
  ROUTES.Hello.ArrayCase,
  ajvValidator('json', getAjvSchema(ArrayCaseDto)),
  async (c: Context) => {
    logger.info(ROUTES.Hello.ArrayCase);

    return c.json({ hello: 'world' });
  },
);

// Case Emoji
HelloController.post(
  ROUTES.Hello.CaseEmoji,
  ajvValidator('json', getAjvSchema(CaseEmojiDto)),
  async (c: Context) => {
    logger.info(ROUTES.Hello.CaseEmoji);

    return c.json({ hello: 'world' });
  },
);

// Case UUID
HelloController.post(
  ROUTES.Hello.CaseUUID,
  ajvValidator('json', getAjvSchema(CaseUuidDto)),
  async (c: Context) => {
    logger.info(ROUTES.Hello.CaseUUID);

    return c.json({ hello: 'world' });
  },
);

export default HelloController;
