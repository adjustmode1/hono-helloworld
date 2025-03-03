import { AjvAddKeyword, AjvField, AjvSchemaObject } from '../decorator';
import { IsEmojiKeyword } from '../keywords/is-emoji.keyword';

@AjvSchemaObject({
  required: ['emoji'],
})
export class CaseEmojiDto {
  @AjvAddKeyword(IsEmojiKeyword)
  @AjvField({
    type: 'string',
    isEmoji: true,
  })
  emoji!: string;
}
