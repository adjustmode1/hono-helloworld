import 'reflect-metadata';

const AJV_SCHEMA_KEY = Symbol('ajv:schema');

export function AjvSchemaObject(schema: object) {
  return function (target: any) {
    const existingSchema = Reflect.getMetadata(AJV_SCHEMA_KEY, target.prototype) || {};
    Reflect.defineMetadata(AJV_SCHEMA_KEY, { ...existingSchema, ...schema }, target.prototype);
  };
}

export function AjvField(schema: object) {
  return function (target: any, propertyKey: string) {
    const existingSchema = Reflect.getMetadata(AJV_SCHEMA_KEY, target) || {};

    if ('enum' in schema && typeof schema.enum === 'object' && schema.enum !== null) {
      const enumValues = Object.values(schema.enum as any);
      schema.enum = enumValues.filter(v => typeof v === 'number');
      schema['x-enum-varnames'] = enumValues.filter(v => isNaN(Number(v)));
    }

    existingSchema['properties'] = {
      ...existingSchema['properties'],
      [propertyKey]: schema
    };
    Reflect.defineMetadata(AJV_SCHEMA_KEY, existingSchema, target);
  };
}

export function getAjvSchema(target: any) {
  const properties =
    Reflect.getMetadata(AJV_SCHEMA_KEY, target.prototype) || {};

  return {
    $id: target.name,
    type: 'object',
    ...properties,
  };
}
