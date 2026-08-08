import clsx from "clsx";

export default function TabBar({ tabs, value, onChange }) {
  return (
    <ol className="flex space-x-2 justify-center">
      {tabs.map((tab) => (
        <li key={tab.value}>
          <button
            onClick={() => onChange(tab.value)}
            className={clsx(
              "px-4 py-2 rounded-control border text-sm tracking-wide font-thin transition-all",
              tab.value === value
                ? "bg-secondary text-white border-secondary"
                : "border-primary/20 hover:bg-primary/5",
            )}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ol>
  );
}
