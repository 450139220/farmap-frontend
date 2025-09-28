function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: number | undefined;

  return function (...args: Parameters<T>): void {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export { debounce };
