import { UserRole } from '../constants/roles.enum';

/** Escape user input before embedding it in a $regex query. */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** School ID of the requesting user — handles populated docs and raw refs. */
export function userSchoolId(user: { school?: unknown } | undefined): string | undefined {
  const school = (user as { school?: { _id?: unknown } | string | null })?.school;
  if (!school) return undefined;
  if (typeof school === 'string') return school;
  const id = (school as { _id?: unknown })._id;
  return id ? String(id) : undefined;
}

/**
 * Tenant scoping: super admins may query any school; everyone else is
 * pinned to their own school regardless of what they request.
 */
export function scopedSchool(
  user: { role?: string; school?: unknown } | undefined,
  requested?: string,
): string | undefined {
  if (user?.role === UserRole.SUPER_ADMIN) return requested;
  return userSchoolId(user);
}
