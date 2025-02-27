import {AjvField, AjvSchemaObject} from "../decorator";

@AjvSchemaObject({
  required: ['hello']
})
export class GetHelloResponse {
  @AjvField({
    type: 'string',
  })
  hello!: string;
}
