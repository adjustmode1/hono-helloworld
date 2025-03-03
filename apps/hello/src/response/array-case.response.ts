import { AjvField, AjvSchemaObject } from '../decorator';

@AjvSchemaObject({
  required: ['hello'],
})
export class ArrayCaseResponse {
  @AjvField({
    type: 'string',
  })
  hello!: string;
}
