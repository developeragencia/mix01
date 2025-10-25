import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ReactNode } from "react";

interface SwipeableCardProps {
  children: ReactNode;
  onSwipe: (direction: "left" | "right") => void;
  onSuperLike?: () => void;
}

export function SwipeableCard({ children, onSwipe, onSuperLike }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        onSwipe("right");
      } else {
        onSwipe("left");
      }
    }
    
    // Super like on swipe up
    if (info.offset.y < -100 && onSuperLike) {
      onSuperLike();
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        cursor: "grab"
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}
