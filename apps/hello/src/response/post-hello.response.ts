import { JSONSchemaType } from 'ajv';

export interface PostHelloResponseInterface {
  hello: string;
}

export const PostHelloSchemaResponse: JSONSchemaType<PostHelloResponseInterface> =
  {
    type: 'object',
    properties: {
      hello: {
        type: 'string',
      },
    },
    required: ['hello'],
  };
