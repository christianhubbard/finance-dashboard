export function BudgetsHeader() {
  return (
    <div className="flex h-14 items-center justify-between">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        Budgets
      </h1>
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="cursor-not-allowed rounded-lg bg-grey-900 px-4 py-4 text-preset-4 font-bold text-white disabled:opacity-100"
      >
        + Add New Budget
      </button>
    </div>
  );
}
