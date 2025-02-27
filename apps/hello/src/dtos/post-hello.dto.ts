import {AjvField, AjvSchemaObject} from '../decorator';


enum MessageEnums {
  messageEnum1 = 0,
  messageEnum2 = 1,
  messageEnum3 = 2,
  messageEnumOptional = 99
}

@AjvSchemaObject({
  oneOf: [
    { required: ["messageOption1"], not: { required: ['messageOption2']} },
    { required: ["messageOption2"], not: { required: ['messageOption1']} },
  ],
  required: ['message']
})
export class PostHelloDto {
  @AjvField({
    type: 'string',
    minLength: 1,
    maxLength: 100,
  })
  message!: string;

  @AjvField({
    type: 'string',
    minLength: 1,
    maxLength: 100,
    additionalProperties: false
  })
  messageOption1!: string;

  @AjvField({
    type: 'string',
    minLength: 1,
    maxLength: 100,
    additionalProperties: false
  })
  messageOption2!: string;

  @AjvField({
    type: 'integer',
    enum: MessageEnums,
  })
  messageEnums!: MessageEnums;
}
