import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";

const TOTAL = 500;
const DIVIDER = 12;
const MIN = 80;
const MAX = TOTAL - MIN;
// How far past the limit the drag can push (raw), before resistance kicks in
const OVERSCROLL = 60;
// Resistance factor: 0.25 means 1px of drag → 0.25px of visual stretch
const RESISTANCE = 0.25;

function elasticClamp(raw: number): number {
  if (raw < MIN) return MIN - (MIN - raw) * RESISTANCE;
  if (raw > MAX) return MAX + (raw - MAX) * RESISTANCE;
  return raw;
}

export default function Resize() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // rawLeft can go slightly past MIN/MAX during drag
  const rawLeft = useMotionValue(200);

  // Visual widths apply elastic resistance near the edges
  const leftWidth = useTransform(rawLeft, elasticClamp);
  const rightWidth = useTransform(leftWidth, (l) => TOTAL - l);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const next = e.clientX - rect.left - DIVIDER / 2;
      // Hard-clamp only to prevent extreme values, elastic mapping handles the feel
      rawLeft.set(Math.max(MIN - OVERSCROLL, Math.min(MAX + OVERSCROLL, next)));
    },
    [isDragging, rawLeft]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    const current = rawLeft.get();
    if (current < MIN || current > MAX) {
      animate(rawLeft, Math.max(MIN, Math.min(MAX, current)), {
        type: "spring",
        stiffness: 400,
        damping: 30,
      });
    }
  }, [rawLeft]);

  return (
    <div className="flex items-center justify-center w-full h-full min-h-screen bg-white">
      <div
        ref={containerRef}
        className="relative flex select-none"
        style={{ height: 400 }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setIsHovering(false);
        }}
      >
        {/* Left rectangle */}
        <motion.div
          className="rounded-2xl bg-gray-100 flex-shrink-0"
          style={{ width: leftWidth, height: 300 }}
        />

        {/* Divider + bubble */}
        <div
          className="relative flex items-center justify-center flex-shrink-0 cursor-col-resize"
          style={{ width: DIVIDER, zIndex: 10 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => !isDragging && setIsHovering(false)}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
        >
          <motion.div
            className="absolute flex items-center justify-center bg-blue-400 rounded-full shadow-md cursor-col-resize"
            style={{ width: 8, height: 20 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isHovering || isDragging
                ? { scale: 1, opacity: 1 }
                : { scale: 0, opacity: 0 }
            }
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          />
        </div>

        {/* Right rectangle */}
        <motion.div
          className="rounded-2xl bg-gray-100 flex-shrink-0"
          style={{ width: rightWidth, height: 300 }}
        />
      </div>
    </div>
  );
}
