import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';
import { createMiddleware } from 'hono/factory';

export interface PostHelloInterface {
  message: string;
  messageOption1: string;
  messageOption2: string;
}

const ajv = new Ajv();

export const PostHelloSchema: JSONSchemaType<PostHelloInterface> = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    messageOption1: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    messageOption2: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
  },
  required: ['message'],
  $id: 'PostHelloSchema',
};

const validate = ajv.compile<PostHelloInterface>(PostHelloSchema);

export const PostHelloDto = createMiddleware(async (c, next) => {
  const request = await c.req.query();

  validate(request);

  const errors: ErrorObject[] | null | undefined = validate.errors;

  if (errors) {
    return c.json(errors, 400);
  }

  await next();
});
