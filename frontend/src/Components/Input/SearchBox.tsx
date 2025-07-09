import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";

interface SearchItem {
  name: string;
  image: string;
  category: string;
}

interface GlobalSearchProps {
  className?: string; // applies to the <input>
}

export default function GlobalSearch({ className = "" }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [filtered, setFiltered] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("settings.json")
      .then((res) => res.json())
      .then((data: SearchItem[]) => setResults(data))
      .catch(() => setResults([]));
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed) {
      const match = results.filter((item) =>
        `${item.name} ${item.category}`
          .toLowerCase()
          .includes(trimmed.toLowerCase())
      );
      setFiltered(match);
      setIsOpen(true);
    } else {
      setFiltered([]);
      setIsOpen(false);
    }
  }, [query, results]);

  return (
    <div className="relative w-full">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none z-10">
          <svg
            className="size-4 text-gray-400 dark:text-white/60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        {/* Search Input with custom className */}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "py-2.5 ps-10 pe-4 block w-full rounded-lg border border-ring/30 sm:text-sm",
            "focus:ring-2 focus:ring-ring/30 focus:outline-none focus:border-transparent",
            "transition duration-300",
            className
          )}
        />
      </div>

      {/* Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700">
          <div className="max-h-72 overflow-y-auto rounded-b-lg scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            {filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setQuery(item.name);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 text-sm cursor-pointer text-gray-800 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                <div className="rounded-full bg-gray-200 size-6 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="flex-1">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
