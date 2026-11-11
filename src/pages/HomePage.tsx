import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { homeData } from '../content';
import { useToc } from '../lib/toc';
import HtmlContent from '../components/HtmlContent';
import Sections from '../components/Sections';
import { scrollToId } from '../lib/scroll';

export default function HomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');

  const jump = (id: string) => {
    scrollToId(id);
    navigate(`/?s=${id}`, { replace: true });
  };

  useEffect(() => {
    toc.report(homeData.toc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section), 80);
    return () => window.clearTimeout(t);
  }, [section]);

  return (
    <div className="page">
      <h1>{homeData.title}</h1>
      <div className="lede">
        <HtmlContent html={homeData.lede} />
      </div>
      <Sections sections={homeData.sections} />
      <footer className="pagefoot">内容依据课程 PPT 整理 · 仅供复习</footer>
    </div>
  );
}
