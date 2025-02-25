export function sanitizeProps<T extends Record<string, unknown>>(
  props: T,
): Record<string, unknown> {
  return Object.keys(props).reduce((res: Record<string, unknown>, key) => {
    if (props[key] !== undefined) {
      res[key] = props[key];
    }
    return res;
  }, {});
}
