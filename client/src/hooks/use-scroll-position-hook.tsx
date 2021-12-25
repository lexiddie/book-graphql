import { useEffect, useState } from 'react';

const useScrollPosition = (): { y: number; max: number } => {
  const [scrollPosition, setScrollPosition] = useState({ y: 0, max: 0 });
  const handleScroll: EventListener = (event: Event) => {
    const { target } = event;
    const { documentElement } = target as Document;
    const { scrollTop, scrollHeight, clientHeight } = documentElement;
    setScrollPosition({ y: scrollTop, max: scrollHeight - clientHeight });
  };

  useEffect(() => {
    window?.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window?.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);

  return { y: scrollPosition.y, max: scrollPosition.max };
};

export default useScrollPosition;
