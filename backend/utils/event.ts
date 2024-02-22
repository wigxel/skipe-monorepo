import { SafeParseReturnType, z, ZodError } from "zod";
import { H3Event, EventHandlerRequest } from "h3";
import { fromZodError } from "zod-validation-error";

/**
 * Validate multipart/form-data payload
 **/
export async function readValidateFormBody<
  TValue extends SafeParseReturnType<unknown, unknown>,
>(
  event: H3Event<EventHandlerRequest>,
  validator: (body: Record<string, unknown>) => Promise<TValue> | TValue,
) {
  try {
    const formData = await readFormData(event);
    return await validator(Object.fromEntries(formData.entries()));
  } catch (error) {
    throw createError(error);
  }
}

/**
 * Extract Zod `safeParse` data or throw an exception if unsuccessful
 **/
export function resolveZodData<
  TResult extends SafeParseReturnType<unknown, unknown>,
>(
  event: H3Event<EventHandlerRequest>,
  result: TResult,
): Extract<TResult, { success: true }>["data"] {
  if (!result.success) {
    const zod_error = fromZodError(result?.error as ZodError);

    const error = createError({
      statusCode: 422,
      stack: zod_error.stack,
      data: {
        kind: "ValidationError",
        message: zod_error.message,
        // @ts-expect-error
        errors: zod_error?.cause?.issues || [],
      },
      message: "ValidationError",
    });

    throw sendError(event, error, import.meta.env.NODE_DEV === "development");
  }

  return result.data;
}
