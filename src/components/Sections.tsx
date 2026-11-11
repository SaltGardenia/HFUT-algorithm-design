import type { Section } from '../content/types';
import HtmlContent from './HtmlContent';
import DemoPlayer from './DemoPlayer';
import QuizCard from './QuizCard';

interface Props {
  sections: Section[];
  /** 各题作答结果：key = `${sectionId}:${blockIndex}` */
  scores?: Record<string, boolean>;
  /** 每题作答回调 */
  onQuizResult?: (key: string, right: boolean) => void;
}

/** 把 content 模块的 sections 渲染成正文（html / demo / quiz 三类 block） */
export default function Sections({ sections, scores, onQuizResult }: Props) {
  return (
    <>
      {sections.map((sec) => {
        const quizIdx = sec.blocks.flatMap((b, i) => (b.type === 'quiz' ? [i] : []));
        const answered = quizIdx.filter((i) => scores?.[`${sec.id}:${i}`] !== undefined).length;
        const right = quizIdx.filter((i) => scores?.[`${sec.id}:${i}`] === true).length;
        return (
          <section key={sec.id} id={sec.id}>
            <h2>{sec.heading}</h2>
            {quizIdx.length > 0 && (
              <p className="quiz-section-score">
                已作答 {answered} / {quizIdx.length} · 答对 {right} 题
              </p>
            )}
            {sec.blocks.map((b, i) => {
              if (b.type === 'html') return <HtmlContent key={i} html={b.html} />;
              if (b.type === 'demo') return <DemoPlayer key={i} name={b.name} title={b.title} />;
              return (
                <QuizCard
                  key={i}
                  quiz={b.quiz}
                  onResult={(r) => onQuizResult?.(`${sec.id}:${i}`, r)}
                />
              );
            })}
          </section>
        );
      })}
    </>
  );
}
