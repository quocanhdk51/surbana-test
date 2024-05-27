import { z } from "zod";

export const locationIdSchema = z.coerce.number().int().nonnegative();

const locationCreateRequest = z.object({
  name: z.string().min(1).max(255),
  key: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-zA-Z0-9]*$/),
  area: z.number().int().nonnegative(),
  location_id: z.number().int().nonnegative().nullable(),
  building_id: z.number().int().nonnegative(),
});

const locationUpdateRequest = locationCreateRequest.extend({
  id: locationIdSchema,
});

function transform<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.transform((data) => ({
    ...data,
    name: data.name.trim(),
    key: data.key.trim(),
  }));
}

export const locationCreateSchema = transform(locationCreateRequest);
export const locationUpdateSchema = transform(locationUpdateRequest);
