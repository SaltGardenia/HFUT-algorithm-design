import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { decks } from './content';
import TopBar from './components/TopBar';
import Sidebar, { SidebarContent } from './components/Sidebar';
import MobileDrawer from './components/MobileDrawer';
import SearchPalette from './components/SearchPalette';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DeckPage from './pages/DeckPage';

/** 各路由的滚动记忆（POP 导航时恢复） */
const scrollPositions = new Map<string, number>();

export default function App() {
  const location = useLocation();
  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentDeck = useMemo(() => {
    const m = location.pathname.match(/^\/deck\/(deck[1-8])/);
    return m ? m[1] : null;
  }, [location.pathname]);

  const subtitle = decks.find((d) => d.id === currentDeck)?.subtitle;

  // ⌘K / Ctrl+K 打开搜索；Esc 关闭抽屉
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 滚动记忆：离开时保存；POP 恢复；新导航回顶部（?s= 定位交给页面处理）
  useEffect(() => {
    const key = location.key;
    return () => {
      scrollPositions.set(key, window.scrollY);
    };
  }, [location.key]);

  useEffect(() => {
    if (navType === 'POP') {
      const y = scrollPositions.get(location.key) ?? 0;
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'auto' }));
    } else if (!location.search) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.key, navType, location.search]);

  // 路由切换时关闭抽屉
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  return (
    <div className="shell">
      <TopBar subtitle={subtitle} onOpenSidebar={() => setDrawerOpen(true)} onOpenSearch={() => setSearchOpen(true)} />

      <div className="shell-body">
        <Sidebar decks={decks} currentDeck={currentDeck} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/deck/:deckId" element={<DeckPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />

      <div className="drawer-root">
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <SidebarContent decks={decks} currentDeck={currentDeck} />
        </MobileDrawer>
      </div>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
