type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="min-h-0 flex-1 px-4 py-6 sm:px-6 md:px-10 md:pb-16 md:pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        {title}
      </h1>
      <p className="mt-4 max-w-md text-preset-4 text-grey-500">
        This section is a placeholder for the MVP. The Overview page has the
        full dashboard preview with mock data from{" "}
        <code className="rounded bg-beige-100 px-1 text-preset-4-bold text-grey-900">
          data/finance.json
        </code>
        .
      </p>
    </main>
  );
}
