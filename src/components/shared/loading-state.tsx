export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="section-card animate-pulse text-center text-muted-foreground">
      {label}...
    </div>
  );
}
