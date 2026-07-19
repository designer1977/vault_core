// Analytics tracking has been removed. This hook returns a no-op for backwards compatibility.
export function useTrackEvent() {
  return () => {};
}