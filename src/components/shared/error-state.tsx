export function ErrorState({ message }: { message: string }) {
  return (
    <div className="section-card text-center text-red-600">
      {message}
    </div>
  );
}
