export default function Spinner({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
      <span>{label}</span>
    </div>
  );
}
