import { AjvSchema } from '../decorator';

export class GetHelloDto {
  @AjvSchema({
    type: 'string',
    minLength: 1,
    maxLength: 100,
    required: ['messageId'],
    $id: 'GetHelloSchema',
  })
  messageId!: string;
}
