import { createContext, useContext, useState, type ReactNode } from 'react';
import type { TocEntry } from '../content/types';

/**
 * 页面 → 外壳侧栏的目录通道：
 * 页面挂载时上报自己的目录与跳转函数，并持续同步 scroll-spy 高亮。
 */
interface TocCtx {
  toc: TocEntry[];
  activeId: string | null;
  jump: ((id: string) => void) | null;
  report: (toc: TocEntry[], jump: (id: string) => void) => void;
  setActive: (id: string | null) => void;
}

const Ctx = createContext<TocCtx>({
  toc: [],
  activeId: null,
  jump: null,
  report: () => {},
  setActive: () => {},
});

export function TocProvider({ children }: { children: ReactNode }) {
  const [toc, setToc] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [jump, setJump] = useState<((id: string) => void) | null>(null);

  const report = (entries: TocEntry[], jumpFn: (id: string) => void) => {
    setToc(entries);
    setJump(() => jumpFn);
  };

  return <Ctx.Provider value={{ toc, activeId, jump, report, setActive: setActiveId }}>{children}</Ctx.Provider>;
}

export const useToc = () => useContext(Ctx);
