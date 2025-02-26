import { JSONSchemaType } from 'ajv';

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
