import { AjvField } from '../decorator';

export class GetHelloDto {
  @AjvField({
    type: 'string',
    minLength: 1,
    maxLength: 100,
    required: ['messageId'],
  })
  messageId!: string;
}
