import { AjvField } from '../decorator';

export class PutHelloDto {
  @AjvField({
    type: 'string',
    minLength: 1,
    maxLength: 100,
    required: ['messageId'],
  })
  messageId!: string;
}
