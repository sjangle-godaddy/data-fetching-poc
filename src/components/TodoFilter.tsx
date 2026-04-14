"use client";

export type FilterValue = "all" | "active" | "completed";

interface TodoFilterProps {
  filter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  activeCount: number;
}

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function TodoFilter({
  filter,
  onFilterChange,
  activeCount,
}: TodoFilterProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {activeCount} item{activeCount !== 1 ? "s" : ""} left
      </span>
      <div className="flex gap-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`rounded-md px-3 py-1 text-sm transition-colors ${
              filter === f.value
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
