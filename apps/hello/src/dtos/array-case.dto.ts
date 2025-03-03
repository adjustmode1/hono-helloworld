import { AjvField, AjvFieldType, AjvSchemaObject } from '../decorator';
import { ItemDto } from './item.dto';

@AjvSchemaObject({
  required: ['arrayField'],
})
export class ArrayCaseDto {
  @AjvFieldType(ItemDto)
  @AjvField({
    type: 'array',
    maxItems: 3,
    minItems: 1,
    items: {
      $ref: 'ItemDto',
    },
  })
  arrayField!: Array<ItemDto>;
}
