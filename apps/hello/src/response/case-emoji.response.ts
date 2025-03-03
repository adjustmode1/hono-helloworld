import { AjvField, AjvSchemaObject } from '../decorator';

@AjvSchemaObject({
  required: ['hello'],
})
export class CaseEmojiResponse {
  @AjvField({
    type: 'string',
  })
  hello!: string;
}
