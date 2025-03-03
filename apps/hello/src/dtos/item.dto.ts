import { AjvField, AjvSchemaObject } from '../decorator';

@AjvSchemaObject({
  required: ['itemNumber'],
})
export class ItemDto {
  @AjvField({
    type: 'number',
  })
  itemNumber!: number;
}
