import { z } from 'zod'

export const passwordSchema = z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
  message: 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.'
})
