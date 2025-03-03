import { AjvField, AjvSchemaObject } from '../decorator';

@AjvSchemaObject({
  required: ['rangeNumber'],
})
export class CaseRangeDto {
  @AjvField({
    type: 'number',
    minimum: 0,
    maximum: 10,
  })
  rangeNumber!: number;
}
