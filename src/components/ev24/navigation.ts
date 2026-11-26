export const EV24_SLIDE_COUNT = 12;

export function clampSlide(index: number, count = EV24_SLIDE_COUNT) {
  if (!Number.isFinite(index)) return 0;
  return Math.max(0, Math.min(count - 1, Math.trunc(index)));
}

export function slideFromHash(hash: string, count = EV24_SLIDE_COUNT) {
  const match = /^#s(\d+)$/.exec(hash);
  return match ? clampSlide(Number(match[1]) - 1, count) : 0;
}

export function chapterProgress(index: number, chapter: number, chapters: number[]) {
  const indexes = chapters.map((value, i) => (value === chapter ? i : -1)).filter((i) => i >= 0);
  if (!indexes.length) return 0;
  return indexes.filter((i) => i <= index).length / indexes.length;
}
