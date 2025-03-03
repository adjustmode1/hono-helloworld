import { AjvField, AjvSchemaObject } from '../decorator';

@AjvSchemaObject({
  required: ['hello'],
})
export class CaseUuidResponse {
  @AjvField({
    type: 'string',
  })
  hello!: string;
}
