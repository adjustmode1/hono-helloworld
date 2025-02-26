import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';
import { createMiddleware } from 'hono/factory';

const ajv = new Ajv();
export interface GetHelloDtoInterface {
  messageId: string;
}

export const GetHelloSchema: JSONSchemaType<GetHelloDtoInterface> = {
  type: 'object',
  properties: {
    messageId: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
  },
  required: ['messageId'],
  $id: 'GetHelloSchema',
};
