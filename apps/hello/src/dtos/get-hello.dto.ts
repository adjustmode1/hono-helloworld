import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';
import { createMiddleware } from 'hono/factory';

const ajv = new Ajv();
export interface GetHelloDtoInterface {
  messageId: string;
}

const GetHelloSchema: JSONSchemaType<GetHelloDtoInterface> = {
  type: 'object',
  properties: {
    messageId: {
      type: 'string',
    },
  },
  required: ['messageId'],
  additionalProperties: true,
};

const validate = ajv.compile(GetHelloSchema);

export const GetHelloDto = createMiddleware(async (c, next) => {
  const request = await c.req.query();

  validate(request);

  const errors: ErrorObject[] | null | undefined = validate.errors;

  if (errors) {
    return c.json(errors, 400);
  }

  await next();
});
