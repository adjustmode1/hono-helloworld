import type { MiddlewareHandler, Context, ValidationTargets } from 'hono';
import Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
import { uniqueSymbol } from 'hono-openapi';
import { OpenAPIV3 } from 'openapi-types';

const ajv = new Ajv();

type AjvResult =
  | { success: true; data: unknown }
  | { success: false; error: ErrorObject[] };

type AjvHook = (
  result: AjvResult,
  c: Context,
) => Response | Promise<Response> | void | Promise<void>;

/**
 * Tạo middleware xác thực bằng AJV
 * @param target Vị trí cần xác thực (json, query, param, ...)
 * @param schema JSON Schema dùng cho AJV
 * @param hook Hook tùy chọn để xử lý kết quả xác thực
 * @returns Middleware handler cho Hono
 */
export function ajvValidator(
  target: keyof ValidationTargets,
  schema: any,
  hook?: AjvHook,
): MiddlewareHandler {
  const validate = ajv.compile(schema);

  const middleware: MiddlewareHandler = async (c, next) => {
    let value;
    switch (target) {
      case 'json':
        value = await c.req.json();
        break;
      case 'query':
        value = c.req.query();
        break;
      case 'param':
        value = c.req.param();
        break;
      default:
        throw new Error(`Unsupported target: ${target}`);
    }

    const valid = validate(value);
    const result: AjvResult = valid
      ? { success: true, data: value }
      : { success: false, error: validate.errors || [] };

    if (hook) {
      const hookResult = await hook(result, c);
      if (hookResult instanceof Response) {
        return hookResult;
      }
    }

    if (!valid) {
      return c.json(
        { error: !result.success ? result.error : result.success },
        400,
      );
    }

    await next();
  };

  middleware[uniqueSymbol] = {
    resolver: async () => generateAjvValidatorDocs(target, schema),
    metadata: { schemaType: 'input' },
  };

  return middleware;
}

export async function generateAjvValidatorDocs<
  Target extends keyof ValidationTargets,
>(target: Target, schema: object) {
  const docs: Partial<OpenAPIV3.OperationObject> = {};

  // Nếu target là "json" hoặc "form", sử dụng requestBody
  if (target === 'form' || target === 'json') {
    const id = (schema as any).$id;
    if (id && typeof id === 'string') {
      docs.requestBody = {
        content: {
          [target === 'json' ? 'application/json' : 'multipart/form-data']: {
            schema: { $ref: `#/components/schemas/${id}Response` },
          },
        },
      };

      docs.responses = {
        200: {
          $ref: `#/components/schemas/${id}Response`,
        },
      } as OpenAPIV3.ResponsesObject;
    }
  } else {
    // Với các target như "query" hoặc "param", chuyển schema thành parameters.
    const parameters: (
      | OpenAPIV3.ReferenceObject
      | OpenAPIV3.ParameterObject
    )[] = [];

    // Nếu schema có $ref và $ref là string, dùng trực tiếp để tham chiếu.
    if ('$ref' in schema && typeof (schema as any).$ref === 'string') {
      parameters.push({
        in: target,
        name: (schema as any).$ref as string, // ép kiểu $ref về string
        schema: schema as OpenAPIV3.SchemaObject,
      });
    } else {
      if ('$id' in schema) {
        parameters.push({
          in: target,
          name: (schema as any).$id as string, // ép kiểu $ref về string
          schema: {
            $ref: `#/components/schemas/${schema.$id}`,
          },
        });

        docs.responses = {
          200: {
            $ref: `#/components/schemas/${schema.$id}Response`,
          },
        } as OpenAPIV3.ResponsesObject;
      }

      // Nếu schema định nghĩa các properties, duyệt qua từng key để tạo parameter riêng.
      const props = (schema as any).properties ?? {};
      for (const [key, value] of Object.entries(props)) {
        parameters.push({
          in: target,
          name: key,
          schema: value as OpenAPIV3.SchemaObject, // ép kiểu value sang SchemaObject
          required: Array.isArray((schema as any).required)
            ? (schema as any).required.includes(key)
            : false,
        });
      }
    }

    docs.parameters = parameters;
  }

  return { docs, components: {} };
}
