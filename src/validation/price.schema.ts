import { z } from 'zod';
import { ValidationError } from '../utils/errors';

export const cryptoPriceSchema = z.object({
  coin: z.string().min(1, 'coin is required'),
  email: z.email('invalid email format')
});

export type CryptoPriceInput = z.infer<typeof cryptoPriceSchema>;

export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    throw new ValidationError(message);
  }
  return result.data;
};
