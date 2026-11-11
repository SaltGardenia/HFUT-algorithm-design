import { motion, useScroll, useSpring } from 'motion/react';
import { useTheme } from '../lib/theme';
import { IconMenu, IconMoon, IconSearch, IconSun } from './icons';

interface Props {
  subtitle?: string;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
}

export default function TopBar({ subtitle, onOpenSidebar, onOpenSearch }: Props) {
  const { theme, toggle } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  return (
    <header className="topbar">
      <button
        className="icon-btn drawer-trigger"
        aria-label="打开目录"
        onClick={onOpenSidebar}
      >
        <IconMenu />
      </button>
      <span className="topbar-title">
        算法设计与分析<span className="accent"> · 复习手册</span>
      </span>
      {subtitle && <span className="topbar-sub">{subtitle}</span>}
      <span className="topbar-spacer" />
      <button className="topbar-btn" onClick={onOpenSearch} aria-label="搜索手册内容">
        <IconSearch size={15} />
        <span>搜索</span>
        <span className="kbd">⌘K</span>
      </button>
      <button
        className="icon-btn"
        onClick={toggle}
        aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
      >
        {theme === 'dark' ? <IconSun /> : <IconMoon />}
      </button>
      <motion.div className="reading-progress" style={{ scaleX }} />
    </header>
  );
}
