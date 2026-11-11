import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * 移动端抽屉：弹簧滑入、支持横向拖拽关闭（速度交接），
 * reduced-motion 时退化为淡入淡出。
 */
export default function MobileDrawer({ open, onClose, children }: Props) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawer-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="drawer material"
            role="dialog"
            aria-label="全站目录"
            initial={reduced ? { opacity: 0 } : { x: -360 }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: -360 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            drag={reduced ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.55, right: 0 }}
            onDragEnd={(_, info) => {
              // 用速度符号而不是位置决定去留（保留手势动量）
              if (info.offset.x < -70 || info.velocity.x < -350) onClose();
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
