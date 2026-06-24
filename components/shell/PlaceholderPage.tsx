type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-4 max-w-md text-preset-4 text-muted">
        This section is a placeholder for the MVP. The Overview page has the
        full dashboard preview with mock data from{" "}
        <code className="rounded bg-surface px-1 text-preset-4-bold text-foreground">
          data/finance.json
        </code>
        .
      </p>
    </main>
  );
}
