import { useEffect, useId, useRef, useState } from "react";
import EditorForm from "./components/EditorForm";
import HeaderImageInput from "./components/HeaderImageInput";
import MemberInput from "./components/MemberInput";
import TitleInput from "./components/TitleInput";
import CategoryInput from "./components/CategoryInput";
import { CONTROL, Field, SelectField } from "./components/EditorField";
import { Button } from "@/components/ui/button";
import { eleOptions } from "./DATA";

// A titled group in the sidebar: a quiet heading above, content on a white
// rounded surface below (the iOS "inset grouped" pattern).
function Section({ title, count, children }) {
  return (
    <section className="space-y-2">
      <h2 className="flex items-baseline gap-2 px-1 text-[13px] font-semibold text-neutral-600">
        {title}
        {count !== undefined && (
          <span className="font-normal tabular-nums text-neutral-500">
            {count}
          </span>
        )}
      </h2>
      {children}
    </section>
  );
}

export default function EditPanel({
  dispatch,
  title,
  setTitle,
  title_th,
  setTitleTh,
  headerImage,
  setHeaderImage,
  author,
  setAuthor,
  editors,
  category,
  setCategory,
  subcategory,
  setSubcategory,
  createdAt,
  setCreatedAt,
  lang,
}) {
  const [selectedEditor, setSelectedEditor] = useState("");
  const dateId = useId();
  const listRef = useRef(null);
  const justAdded = useRef(false);

  function handleAddEditor() {
    if (!selectedEditor) return;
    const parsed = JSON.parse(selectedEditor);
    const newEditor = {
      type: parsed.type,
      load: parsed.load,
      config: { align: "left", bg: "white", width: 480 },
      expanded: true,
      visible: true,
      desc: parsed.desc,
    };
    justAdded.current = true;
    dispatch({ type: "ADD", payload: newEditor });
  }

  // The list scrolls, so a new block could land out of sight. Only for blocks
  // the user just added; loading a saved blog also grows the list and
  // shouldn't jump anywhere.
  useEffect(() => {
    if (!justAdded.current) return;
    justAdded.current = false;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    listRef.current?.lastElementChild?.scrollIntoView({
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [editors.length]);

  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col border-r border-neutral-200 bg-[#f2f2f7]">
      <div className="thin-scrollbar-dark min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
        <Section title="Post details">
          <div className="space-y-4 rounded-xl bg-white p-4">
            <TitleInput
              title={title}
              setTitle={setTitle}
              title_th={title_th}
              setTitleTh={setTitleTh}
              lang={lang}
            />
            <CategoryInput
              category={category}
              subcategory={subcategory}
              setCategory={setCategory}
              setSubcategory={setSubcategory}
            />
            <HeaderImageInput
              headerImage={headerImage}
              setHeaderImage={setHeaderImage}
            />
            {category === "perspectives" && (
              <MemberInput author={author} setAuthor={setAuthor} />
            )}
            <Field label="Created at" htmlFor={dateId}>
              <input
                id={dateId}
                type="date"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                className={CONTROL}
              />
            </Field>
          </div>
        </Section>

        <Section title="Blog elements" count={editors.length}>
          {editors.length === 0 ? (
            <p className="rounded-xl bg-white px-4 py-8 text-center text-sm leading-relaxed text-neutral-600">
              Nothing here yet. Choose an element below to start building the
              post.
            </p>
          ) : (
            <div
              ref={listRef}
              className="divide-y divide-neutral-200 overflow-hidden rounded-xl bg-white"
            >
              {editors.map((editor, ind) => (
                <EditorForm
                  key={ind}
                  editor={editor}
                  desc={editor.desc}
                  index={ind}
                  dispatch={dispatch}
                  lang={lang}
                  isFirst={ind === 0}
                  isLast={ind === editors.length - 1}
                />
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* Fixed to the bottom of the sidebar so adding a block never means
          scrolling past every block already on the page. */}
      <div className="flex shrink-0 gap-2 border-t border-neutral-200 bg-white p-3">
        <div className="flex-1">
          <SelectField
            aria-label="Element type"
            value={selectedEditor}
            onChange={(e) => setSelectedEditor(e.target.value)}
          >
            <option value="">Choose an element…</option>
            {eleOptions.map((ele) => (
              <option
                key={ele.type}
                value={JSON.stringify({
                  load: ele.load,
                  type: ele.type,
                  desc: ele.desc,
                })}
              >
                {ele.label}
              </option>
            ))}
          </SelectField>
        </div>
        <Button
          size="lg"
          onClick={handleAddEditor}
          disabled={!selectedEditor}
          className="h-10"
        >
          Add
        </Button>
      </div>
    </aside>
  );
}
