import {
  AjvAddFormat,
  AjvAddKeyword,
  AjvField,
  AjvSchemaObject,
} from '../decorator';
import { CustomUUIDFormat } from '../formats/uuid.format';

@AjvSchemaObject({
  required: ['id'],
})
export class CaseUuidDto {
  @AjvAddFormat('UUID', CustomUUIDFormat)
  @AjvField({
    type: 'string',
    format: 'UUID',
  })
  id!: string;
}
