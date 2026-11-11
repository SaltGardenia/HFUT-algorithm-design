/** 平滑滚动到页面内锚点（尊重 prefers-reduced-motion） */
export function scrollToId(id: string, instant = false) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: instant || reduced ? 'auto' : 'smooth', block: 'start' });
  return true;
}

export const DECK_IDS = ['deck1', 'deck2', 'deck3', 'deck4', 'deck5', 'deck6', 'deck7', 'deck8'];

/** 「deck2.html」/「deck2.html#sec-quiz」/「index.html#x」→ 路由信息；无法识别返回 null */
export function parseLegacyHref(
  href: string
): { deck: string | null; section: string | null } | null {
  const m = href.match(/^(?:\.\.\/)?(deck[1-8]|index)\.html(?:#(sec-[\w-]+))?$/);
  if (!m) return null;
  return { deck: m[1] === 'index' ? null : m[1], section: m[2]?.slice(1) ?? null };
}
