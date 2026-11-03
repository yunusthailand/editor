import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "th", label: "ภาษาไทย" },
];

// Lives in the document flow at the top of the preview column and sticks there
// while scrolling. Unlike the floating card it replaces, it never overlays the
// side panel, so nothing in the panel can be covered by it.
export default function EditorToolbar({ lang, setLang, isEditing, onSave }) {
  const activeIndex = LANGUAGES.findIndex((option) => option.value === lang);

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-neutral-200 bg-white/90 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-neutral-600">Editing language</span>

        {/* Segmented control: one thumb slides between the options instead of
            each button fading its own fill, so the change reads as a single
            movement (and can be reversed mid-way, since it's a transition). */}
        <div
          role="group"
          aria-label="Editing language"
          className="relative grid grid-cols-2 rounded-control bg-neutral-100 p-0.5 text-[13px]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-[0.4rem] bg-secondary transition-transform duration-300 ease-drawer motion-reduce:transition-none"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          {LANGUAGES.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={lang === option.value}
              onClick={() => setLang(option.value)}
              className={cn(
                "relative rounded-[0.4rem] px-4 py-1.5 font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 motion-reduce:transition-none",
                lang === option.value
                  ? "text-white"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={onSave}>{isEditing ? "Update" : "Create"}</Button>
    </div>
  );
}
