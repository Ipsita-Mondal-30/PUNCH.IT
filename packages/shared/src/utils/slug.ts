export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 255);
}

export async function resolveUniqueSlug(
  baseSlug: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const normalized = toSlug(baseSlug) || 'project';
  let candidate = normalized;
  let suffix = 2;

  while (await exists(candidate)) {
    candidate = `${normalized}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
