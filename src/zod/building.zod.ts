import { z } from "zod";

export const buildingIdSchema = z.coerce.number().int().nonnegative();

const buildingCreateRequest = z.object({
  name: z.string().min(1).max(255),
  key: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-zA-Z0-9]*$/),
});
const buildingUpdateRequest = buildingCreateRequest.extend({
  id: buildingIdSchema,
});

function transform<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.transform((data) => ({
    ...data,
    name: data.name.trim(),
    key: data.key.trim(),
  }));
}

export const buildingCreateSchema = transform(buildingCreateRequest);
export const buildingUpdateSchema = transform(buildingUpdateRequest);
