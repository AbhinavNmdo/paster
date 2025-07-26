import { useState, useEffect, RefObject } from 'react';

export function useMousePosition(ref: RefObject<HTMLElement>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;

    const handleMouseMove = (event: MouseEvent) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [ref]);

  return position;
}
