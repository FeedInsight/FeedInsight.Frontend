import { z } from 'zod'

/**
 * Shared zod schemas used by react-hook-form's zodResolver across multiple
 * features. Feature-specific schemas (e.g. the full feedback form schema)
 * should live next to their form component instead -- only put a schema
 * here if 2+ features need the exact same validation rule.
 */
export const emailSchema = z.string().email('Enter a valid email address')

export const requiredString = (label) => z.string().min(1, `${label} is required`)
