import 'reflect-metadata';

const AJV_SCHEMA_KEY = Symbol('ajv:schema');

export function AjvSchema(schema: object) {
  return function (target: any, propertyKey: string) {
    const existingSchema = Reflect.getMetadata(AJV_SCHEMA_KEY, target) || {};
    existingSchema[propertyKey] = schema;
    Reflect.defineMetadata(AJV_SCHEMA_KEY, existingSchema, target);
  };
}

export function getAjvSchema(target: any) {
  const properties =
    Reflect.getMetadata(AJV_SCHEMA_KEY, target.prototype) || {};
  return {
    $id: target.name + 'Schema',
    type: 'object',
    properties,
    required: Object.keys(properties),
  };
}
