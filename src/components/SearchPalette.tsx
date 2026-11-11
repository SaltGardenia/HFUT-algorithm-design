import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { decks, homeData } from '../content';
import { IconSearch } from './icons';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface IndexItem {
  kind: '章节' | '动画' | '题目';
  deck: string | null; // null = 首页
  deckTitle: string;
  sectionId: string;
  text: string;
}

const stripTags = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function buildIndex(): IndexItem[] {
  const items: IndexItem[] = [];
  for (const deck of decks) {
    const demoSection = new Map<string, string>();
    const quizSectionIds = new Set<string>();
    for (const sec of deck.sections) {
      for (const b of sec.blocks) {
        if (b.type === 'demo' && !demoSection.has(b.name)) demoSection.set(b.name, sec.id);
        if (b.type === 'quiz') quizSectionIds.add(sec.id);
      }
    }
    for (const t of deck.toc) {
      items.push({ kind: '章节', deck: deck.id, deckTitle: deck.title, sectionId: t.id, text: `${t.text}` });
    }
    for (const [name, secId] of demoSection) {
      const block = deck.sections.flatMap((s) => s.blocks).find((b) => b.type === 'demo' && b.name === name);
      const title = block && block.type === 'demo' ? block.title : name;
      items.push({ kind: '动画', deck: deck.id, deckTitle: deck.title, sectionId: secId, text: title });
    }
    for (const sec of deck.sections) {
      if (!quizSectionIds.has(sec.id)) continue;
      for (const b of sec.blocks) {
        if (b.type !== 'quiz') continue;
        items.push({
          kind: '题目',
          deck: deck.id,
          deckTitle: deck.title,
          sectionId: sec.id,
          text: stripTags(b.quiz.question).slice(0, 64),
        });
      }
    }
  }
  for (const t of homeData.toc) {
    items.push({ kind: '章节', deck: null, deckTitle: '总目录', sectionId: t.id, text: t.text });
  }
  return items;
}

export default function SearchPalette({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(buildIndex, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const hits: { item: IndexItem; score: number }[] = [];
    for (const item of index) {
      const hay = item.text.toLowerCase();
      const idx = hay.indexOf(q);
      if (idx < 0) continue;
      hits.push({ item, score: idx === 0 ? 0 : idx < 6 ? 1 : 2 });
      if (hits.length > 400) break;
    }
    return hits.sort((a, b) => a.score - b.score).slice(0, 24).map((h) => h.item);
  }, [query, index]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const select = (item: IndexItem) => {
    onClose();
    if (item.deck) navigate(`/deck/${item.deck}?s=${item.sectionId}`);
    else navigate(`/?s=${item.sectionId}`);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      if (results[active]) select(results[active]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="palette-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
      />
      <motion.div
        className="palette"
        role="dialog"
        aria-label="搜索手册"
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -6 }}
        transition={{ type: 'spring', stiffness: 480, damping: 34 }}
        style={{ transformOrigin: 'top center' }}
        onKeyDown={onKeyDown}
      >
        <div className="palette-input">
          <IconSearch size={17} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索章节、动画与自测题…"
            aria-label="搜索关键词"
          />
          <span className="kbd" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
            ESC
          </span>
        </div>
        <ul className="palette-list">
          {results.length === 0 && <li className="palette-empty">{query ? '没有匹配的内容' : '输入关键词，跳转到任意章节 / 动画 / 题目'}</li>}
          {results.map((item, i) => (
            <li
              key={`${item.deck}-${item.sectionId}-${i}`}
              className={`palette-item${i === active ? ' active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => select(item)}
            >
              <span className="pi-kind">{item.kind}</span>
              <span className="pi-text">{item.text}</span>
              <span className="pi-path">{item.deck ? item.deckTitle : '首页'}</span>
            </li>
          ))}
        </ul>
        <div className="palette-foot">
          <span>
            <span className="kbd">↑</span>
            <span className="kbd">↓</span>
            切换
          </span>
          <span>
            <span className="kbd">↵</span>
            跳转
          </span>
          <span>
            <span className="kbd">ESC</span>
            关闭
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
