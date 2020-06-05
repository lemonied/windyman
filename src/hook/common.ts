import { useEffect, useRef, useState } from 'react';

export const usePrevious = <T=any>(value: T): T | undefined => {
  const prev = useRef<T>();

  useEffect(() => {
    prev.current = value;
  }, [value]);

  return prev.current;
};

export const useToggle = (value = false): [boolean, (bol: boolean) => void] => {
  const [val, setVal] = useState<boolean>(value);
  return [val, setVal];
};
