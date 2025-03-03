import { AjvField, AjvSchemaObject } from '../decorator';

@AjvSchemaObject({
  required: ['hello'],
})
export class PutHelloResponse {
  @AjvField({
    type: 'string',
  })
  hello!: string;
}
