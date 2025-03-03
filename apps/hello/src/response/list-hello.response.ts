import { AjvField, AjvSchemaObject } from '../decorator';

@AjvSchemaObject({
  required: ['hello'],
})
export class ListHelloResponse {
  @AjvField({
    type: 'string',
  })
  hello!: string;
}
