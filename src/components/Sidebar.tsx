import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { TocEntry } from '../content/types';
import { useToc } from '../lib/toc';

/** 各讲所属的 PPT 讲次（deck1/deck2 同属第 1 讲课件） */
const LECTURE_NO = ['L1', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];

export interface DeckMetaLite {
  id: string;
  no: string;
  title: string;
}

interface Props {
  decks: DeckMetaLite[];
  currentDeck: string | null;
}

function TocLink({ e, active, onJump }: { e: TocEntry; active: boolean; onJump: (id: string) => void }) {
  return (
    <a
      href={`#${e.id}`}
      className={active ? 'active' : e.level === 3 ? 'lvl3' : undefined}
      onClick={(ev) => {
        ev.preventDefault();
        onJump(e.id);
      }}
    >
      {active && <motion.span layoutId="toc-indicator" className="toc-indicator" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
      {e.text}
    </a>
  );
}

/** 侧栏内容（桌面侧栏与移动端抽屉共用） */
export function SidebarContent({ decks, currentDeck }: Props) {
  const { toc, activeId, jump } = useToc();
  return (
    <>
      <p className="sidebar-h">全站导航</p>
      <ul className="site-nav">
        <li>
          <Link to="/" className={currentDeck === null ? 'active' : undefined}>
            <span className="nav-no">◎</span>
            总目录 · 考点速查
          </Link>
        </li>
        {decks.map((d, i) => (
          <li key={d.id}>
            <Link to={`/deck/${d.id}`} className={currentDeck === d.id ? 'active' : undefined}>
              <span className="nav-no">{LECTURE_NO[i]}</span>
              {d.title}
            </Link>
          </li>
        ))}
      </ul>

      {toc.length > 0 && (
        <>
          <p className="sidebar-h">本页内容</p>
          <ul className="toc">
            {toc.map((e) => (
              <li key={e.id}>
                <TocLink e={e} active={activeId === e.id} onJump={(id) => jump?.(id)} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default function Sidebar(props: Props) {
  return (
    <nav className="sidebar material" aria-label="全站目录">
      <SidebarContent {...props} />
    </nav>
  );
}
