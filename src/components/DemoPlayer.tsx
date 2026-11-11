import { useEffect, useMemo, useRef, useState, type ComponentType, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { registry } from './demos/registry';
import { IconNext, IconPause, IconPlay, IconPrev, IconReset } from './icons';

const PLAY_INTERVAL = 950;

interface Props {
  name: string;
  title: string;
}

/**
 * 统一的动画播放器：接收 content 里的 demo 名，从 registry 取出
 * 帧数据（build）与帧渲染器（View），提供 Apple 风格的控制条、
 * 可拖拽 scrubber、键盘控制（←/→/空格/Home/End）。
 */
export default function DemoPlayer({ name, title }: Props) {
  const def = registry[name];
  const frames = useMemo(() => (def ? (def.build() as never[]) : []), [def]);
  const total = frames.length;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // 自动播放：定时推进；到达末帧自动停
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, total - 1)), PLAY_INTERVAL);
    return () => window.clearInterval(id);
  }, [playing, total]);

  useEffect(() => {
    if (playing && step >= total - 1) setPlaying(false);
  }, [playing, step, total]);

  if (!def) {
    return (
      <div className="demo">
        <div className="demo-bar">
          <span className="demo-title">{title}</span>
        </div>
        <div className="demo-stage">
          <p className="demo-cap">（未找到名为 <code>{name}</code> 的动画组件）</p>
        </div>
      </div>
    );
  }

  const { View, w, h } = def as { View: ComponentType<{ frame: never }>; w: number; h: number };
  const frame = frames[step] as never;

  const go = (next: number | ((prev: number) => number)) => {
    setPlaying(false);
    setStep((s) => {
      const v = typeof next === 'function' ? next(s) : next;
      return Math.max(0, Math.min(total - 1, v));
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(step - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(step + 1);
    } else if (e.key === ' ') {
      e.preventDefault();
      setPlaying((p) => !p);
    } else if (e.key === 'Home') {
      e.preventDefault();
      go(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      go(total - 1);
    }
  };

  const cap = (frames[step] as { cap?: string })?.cap ?? '';

  return (
    <div className="demo" ref={boxRef} tabIndex={0} onKeyDown={onKeyDown} role="group" aria-label={title}>
      <div className="demo-bar">
        <span className="demo-title">{title}</span>
        <span className="demo-ctl">
          <span className="demo-step-chip">
            第 {step + 1} / {total} 步
          </span>
          <button className="ctl-btn" aria-label="重置" title="重置 (Home)" disabled={step === 0 && !playing} onClick={() => go(0)}>
            <IconReset size={16} />
          </button>
          <button className="ctl-btn" aria-label="上一步" title="上一步 (←)" disabled={step === 0} onClick={() => go(step - 1)}>
            <IconPrev size={16} />
          </button>
          <button
            className={`ctl-btn${playing ? ' is-on' : ''}`}
            aria-label={playing ? '暂停' : '播放'}
            title={playing ? '暂停 (空格)' : '播放 (空格)'}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <IconPause size={16} /> : <IconPlay size={16} />}
          </button>
          <button
            className="ctl-btn"
            aria-label="下一步"
            title="下一步 (→)"
            disabled={step >= total - 1}
            onClick={() => go(step + 1)}
          >
            <IconNext size={16} />
          </button>
        </span>
      </div>

      <div className="demo-stage">
        <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title} preserveAspectRatio="xMidYMid meet" style={{ maxWidth: w }}>
          <View frame={frame} />
        </svg>
      </div>

      <div className="demo-scrub">
        <input
          type="range"
          min={0}
          max={Math.max(0, total - 1)}
          value={step}
          onChange={(e) => go(Number(e.target.value))}
          aria-label="拖动查看任意步骤"
          style={{ accentColor: 'var(--accent)' }}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={step}
          className="demo-cap"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          dangerouslySetInnerHTML={{ __html: cap }}
        />
      </AnimatePresence>
    </div>
  );
}
