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
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b bg-white/90 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="text-xs text-primary/60">Editing language</span>
        <div
          role="group"
          aria-label="Editing language"
          className="flex rounded-control border border-primary/20 p-0.5 text-xs"
        >
          {LANGUAGES.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={lang === option.value}
              onClick={() => setLang(option.value)}
              className={cn(
                "rounded-[0.4rem] px-3 py-1.5 font-medium transition-all",
                lang === option.value
                  ? "bg-secondary text-white"
                  : "text-primary/60 hover:bg-primary/5",
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
