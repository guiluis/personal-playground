import { useState, useRef, useCallback } from "react";

export function CursorFollowing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPos(null);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full overflow-hidden"
      style={{ cursor: "default" }}
    >
      {pos && (
        <>
          {/* Vertical line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-gray-200 pointer-events-none"
            style={{ left: pos.x }}
          />
          {/* Horizontal line */}
          <div
            className="absolute left-0 right-0 h-px bg-gray-200 pointer-events-none"
            style={{ top: pos.y }}
          />
          {/* Coordinate badge */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: pos.x + 12,
              top: pos.y - 36,
            }}
          >
            <span
              className="bg-gray-100 text-gray-400 text-xs px-2.5 py-1 whitespace-nowrap"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {Math.round(pos.x)}, {Math.round(pos.y)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
