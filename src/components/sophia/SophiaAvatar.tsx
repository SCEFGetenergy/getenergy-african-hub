import { cn } from "@/lib/utils";

/** SOPHIA mark: a bolt inside a ring, in brand blue and green. */
export function SophiaAvatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-secondary",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[55%]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M13 2 5 13h6l-1 9 8-11h-6l1-9Z" fill="currentColor" />
      </svg>
    </span>
  );
}
