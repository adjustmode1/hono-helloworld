export function IsEmojiKeyword() {
  return {
    keyword: 'isEmoji',
    type: 'string',
    validate: (schema, data) => false,
  };
}
