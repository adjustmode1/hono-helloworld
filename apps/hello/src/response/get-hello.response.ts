import { JSONSchemaType } from 'ajv';

export interface GetHelloResponseInterface {
  hello: string;
}

export const GetHelloSchemaResponse: JSONSchemaType<GetHelloResponseInterface> =
  {
    type: 'object',
    properties: {
      hello: {
        type: 'string',
      },
    },
    required: ['hello'],
  };
