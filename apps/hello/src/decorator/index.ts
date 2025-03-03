import 'reflect-metadata';

import Ajv from 'ajv';

const AJV_SCHEMA_KEY = Symbol('ajv:schema');

export const ajv = new Ajv({
  strict: false,
  allowUnionTypes: true,
});

export function AjvAddKeyword(schema: any) {
  return function (target: any, propertyKey: string) {
    if (schema) {
      ajv.addKeyword(schema());
    }
  };
}

export function AjvAddFormat(name: string, schema: any) {
  return function (target: any, propertyKey: string) {
    if (schema) {
      ajv.addFormat(name, schema());
    }
  };
}

export function AjvSchemaObject(schema: object) {
  return function (target: any) {
    const existingSchema =
      Reflect.getMetadata(AJV_SCHEMA_KEY, target.prototype) || {};

    Reflect.defineMetadata(
      AJV_SCHEMA_KEY,
      { ...existingSchema, ...schema, $id: target.name },
      target.prototype,
    );
  };
}

export function AjvField(schema: object) {
  return function (target: any, propertyKey: string) {
    const existingSchema = Reflect.getMetadata(AJV_SCHEMA_KEY, target) || {};

    if (
      'enum' in schema &&
      typeof schema.enum === 'object' &&
      schema.enum !== null
    ) {
      const enumValues = Object.values(schema.enum as any);
      schema.enum = enumValues.filter((v) => typeof v === 'number');
      schema['x-enum-varnames'] = enumValues.filter((v) => isNaN(Number(v)));
    }

    existingSchema['properties'] = {
      ...existingSchema['properties'],
      [propertyKey]: schema,
    };
    Reflect.defineMetadata(AJV_SCHEMA_KEY, existingSchema, target);
  };
}

export function AjvFieldType(schema: any) {
  return function (target: any, propertyKey: string) {
    const existingSchema =
      Reflect.getMetadata(AJV_SCHEMA_KEY, schema.prototype) || {};

    if (existingSchema) {
      console.log(existingSchema);
      ajv.addSchema(existingSchema);
    }
  };
}

export function getAjvSchema(target: any) {
  const properties =
    Reflect.getMetadata(AJV_SCHEMA_KEY, target.prototype) || {};

  const schema = {
    $id: target.name,
    type: 'object',
    additionalProperties: false,
    ...properties,
  };

  if (!ajv.getSchema(`${target.name}`)) {
    ajv.addSchema(schema);
  }

  return schema;
}
