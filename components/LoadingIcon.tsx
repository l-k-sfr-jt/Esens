export function LoadingIcon() {
  return (
    <svg
      className="h-6 w-6 motion-safe:animate-spin text-white"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      <circle
        className="opacity-80"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="60"
        strokeDashoffset="20"
        fill="none"
      />
    </svg>
  );
}
