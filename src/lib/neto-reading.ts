export const READING_SIZES = [20, 24, 28] as const;
export type ReadingSize = typeof READING_SIZES[number];
export function readingSize(value: string | null): ReadingSize {
  return READING_SIZES.find(size => String(size) === value) ?? 20;
}
export function nextReadingSize(size: ReadingSize): ReadingSize {
  return size === 20 ? 24 : size === 24 ? 28 : 20;
}