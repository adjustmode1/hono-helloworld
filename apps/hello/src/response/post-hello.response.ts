import {AjvField, AjvSchemaObject} from "../decorator";

@AjvSchemaObject({
  required: ['hello']
})
export class PostHelloResponse {
  @AjvField({
    type: 'string',
  })
  hello!: string;
}
