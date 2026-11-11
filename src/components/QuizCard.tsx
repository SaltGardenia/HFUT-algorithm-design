import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { QuizData } from '../content/types';
import { IconCheck, IconReset, IconX } from './icons';

interface Props {
  quiz: QuizData;
  /** 答对回调（用于章节计分） */
  onResult?: (right: boolean) => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const OPTION_PREFIX = /^[A-F][.．、]\s*/;

function decodeEntities(s: string): string {
  const el = document.createElement('textarea');
  el.innerHTML = s;
  return el.value;
}

const normalize = (s: string) => s.replace(/\s+/g, '').replace(/　/g, '');

export default function QuizCard({ quiz, onResult }: Props) {
  const correctLetters = useMemo<string[]>(() => {
    if (quiz.kind === 'single' || quiz.kind === 'multi') {
      return quiz.answer.split('、');
    }
    if (quiz.kind === 'judge') {
      // 判断题：答案「对 / 错」对应选项文本
      const idx = (quiz.options ?? []).findIndex(
        (o) => decodeEntities(o).replace(OPTION_PREFIX, '').trim() === quiz.answer,
      );
      return idx >= 0 ? [LETTERS[idx]] : [];
    }
    return [];
  }, [quiz]);

  const [picked, setPicked] = useState<string[]>([]); // multi 的多选状态 / single 的当前选择
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<'right' | 'wrong' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [fillInput, setFillInput] = useState('');
  const [fillWrong, setFillWrong] = useState(false);

  const showExplanation = submitted !== null || revealed;
  const cls = submitted === 'right' ? ' answered-right' : submitted === 'wrong' ? ' answered-wrong' : '';

  const pick = (letter: string) => {
    if (submitted === 'right') return;
    if (quiz.kind === 'multi') {
      setPicked((p) => (p.includes(letter) ? p.filter((l) => l !== letter) : [...p, letter]));
      return;
    }
    // single / judge：点击即判
    if (letter === correctLetters[0]) {
      setPicked([letter]);
      setWrongPicks([]);
      setSubmitted('right');
      onResult?.(true);
    } else {
      setPicked([]);
      setWrongPicks((w) => (w.includes(letter) ? w : [...w, letter]));
      setSubmitted('wrong');
      onResult?.(false);
    }
  };

  const submitMulti = () => {
    const ok =
      picked.length === correctLetters.length && correctLetters.every((l) => picked.includes(l));
    setSubmitted(ok ? 'right' : 'wrong');
    if (!ok) setWrongPicks(picked.filter((l) => !correctLetters.includes(l)));
    onResult?.(ok);
  };

  const checkFill = () => {
    if (!fillInput.trim()) return;
    const ok = normalize(decodeEntities(quiz.answer)) === normalize(fillInput);
    if (ok) {
      setSubmitted('right');
      setFillWrong(false);
      onResult?.(true);
    } else {
      setFillWrong(true);
      setSubmitted('wrong');
      onResult?.(false);
    }
  };

  const reset = () => {
    setPicked([]);
    setWrongPicks([]);
    setSubmitted(null);
    setRevealed(false);
    setFillInput('');
    setFillWrong(false);
  };

  const optionState = (letter: string): string => {
    if (submitted === 'right' && correctLetters.includes(letter)) return 'correct';
    if (wrongPicks.includes(letter)) return 'wrong';
    if (quiz.kind === 'multi' && submitted === 'wrong' && correctLetters.includes(letter) && picked.includes(letter))
      return 'wrong';
    if (quiz.kind === 'multi' && submitted === 'wrong' && correctLetters.includes(letter)) return 'correct';
    if (picked.includes(letter)) return 'selected';
    if (submitted !== null && quiz.kind !== 'fill' && !correctLetters.includes(letter) && !picked.includes(letter))
      return 'dim';
    return '';
  };

  const interactive = submitted !== 'right' && quiz.kind !== 'fill';

  return (
    <div className={`quiz${cls}`}>
      <p className="quiz-q">
        {quiz.question}
        {quiz.tag && <span className="quiz-tag">{quiz.tag}</span>}
      </p>

      {(quiz.kind === 'single' || quiz.kind === 'multi' || quiz.kind === 'judge') && (
        <ul className="quiz-opt">
          {(quiz.options ?? []).map((o, i) => {
            const letter = LETTERS[i];
            const st = optionState(letter);
            return (
              <li key={i}>
                <button
                  type="button"
                  className={`opt-btn${st ? ' ' + st : ''}`}
                  disabled={!interactive && submitted === 'right'}
                  onClick={() => pick(letter)}
                >
                  <span className="opt-key">{letter}</span>
                  <span dangerouslySetInnerHTML={{ __html: o }} />
                  {st === 'correct' && <IconCheck size={16} style={{ marginLeft: 'auto', color: 'var(--ok)' }} />}
                  {st === 'wrong' && <IconX size={16} style={{ marginLeft: 'auto', color: 'var(--hot)' }} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {quiz.kind === 'multi' && submitted === null && (
        <div className="quiz-actions">
          <button className="btn primary" disabled={picked.length === 0} onClick={submitMulti}>
            提交答案（{picked.length} 项）
          </button>
          <button className="btn" onClick={() => setRevealed(true)}>
            直接看答案
          </button>
        </div>
      )}

      {quiz.kind === 'fill' && submitted === null && !revealed && (
        <>
          <div className="quiz-fill">
            <input
              value={fillInput}
              placeholder="输入你的答案…"
              onChange={(e) => setFillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkFill()}
              aria-label="填空答案"
            />
            <button className="btn primary" onClick={checkFill}>
              检查
            </button>
            <button className="btn" onClick={() => setRevealed(true)}>
              显示答案
            </button>
          </div>
          {fillWrong && <p className="quiz-note">不完全一致——填空题术语要写全，可对照答案核对（见下方解析）。</p>}
        </>
      )}

      {(submitted !== null || revealed) && (
        <div className="quiz-actions">
          <button className="btn" onClick={reset}>
            <IconReset size={14} />
            重做
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {showExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p className="quiz-a">
              <b>答案：{quiz.answer}</b>　<span dangerouslySetInnerHTML={{ __html: quiz.explanation }} />
            </p>
            {quiz.note && <p className="quiz-note" dangerouslySetInnerHTML={{ __html: quiz.note }} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
