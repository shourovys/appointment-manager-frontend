import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_API_TIMEOUT: z.coerce.number().positive(),
  VITE_ENABLE_ANALYTICS: z.coerce.boolean(),
  VITE_ENABLE_SENTRY: z.coerce.boolean(),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(import.meta.env);

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

export const env = validateEnv();
