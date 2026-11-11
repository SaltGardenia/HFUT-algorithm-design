import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { decks } from '../content';
import type { DeckData } from '../content/types';
import { useToc } from '../lib/toc';
import HtmlContent from '../components/HtmlContent';
import Sections from '../components/Sections';
import { scrollToId } from '../lib/scroll';

export default function DeckPage() {
  const { deckId } = useParams();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return <Navigate to="/" replace />;
  return <DeckInner key={deck.id} deck={deck} />;
}

function DeckInner({ deck }: { deck: DeckData }) {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const [scores, setScores] = useState<Record<string, boolean>>({});
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const jump = (id: string) => {
    scrollToId(id);
    navigate(`/deck/${deck.id}?s=${id}`, { replace: true });
  };

  // 上报目录到外壳侧栏
  useEffect(() => {
    toc.report(deck.toc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.id]);

  // ?s=sec-id 深链：首次直接定位，此后平滑滚动
  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section, firstRender.current), 80);
    firstRender.current = false;
    return () => window.clearTimeout(t);
  }, [section]);

  // scroll-spy：观察正文里的 h2 / h3，同步到侧栏目录
  useEffect(() => {
    const root = pageRef.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const heads = Array.from(root.querySelectorAll('h2[id], h3[id]'));
        const best = heads.find((h) => visible.get(h.id));
        if (best) toc.setActive(best.id);
      },
      { rootMargin: '-72px 0px -68% 0px', threshold: 0 },
    );
    for (const h of Array.from(root.querySelectorAll('h2[id], h3[id]'))) io.observe(h);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.id]);

  return (
    <div className="page" ref={pageRef} data-deck={deck.id}>
      <h1>{deck.title}</h1>
      <div className="lede">
        <HtmlContent html={deck.lede} />
      </div>
      <Sections
        sections={deck.sections}
        scores={scores}
        onQuizResult={(key, right) => setScores((s) => ({ ...s, [key]: right }))}
      />
      <footer className="pagefoot">内容依据课程 PPT 整理 · 仅供复习</footer>
    </div>
  );
}
