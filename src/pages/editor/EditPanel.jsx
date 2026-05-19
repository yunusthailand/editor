import { useState } from "react";

import EditorForm from "./components/EditorForm";

import HeaderImageInput from "./components/HeaderImageInput";

import MemberInput from "./components/MemberInput";

import TitleInput from "./components/TitleInput";

import CategoryInput from "./components/CategoryInput";

import { eleOptions } from "./DATA";

export default function EditPanel({
  dispatch,
  title,
  setTitle,
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
}) {
  const [selectedEditor, setSelectedEditor] = useState("");

  function handleAddEditor() {
    if (!selectedEditor) return;

    const parsed = JSON.parse(selectedEditor);

    const newEditor = {
      type: parsed.type,

      load: parsed.load,

      config: {
        align: "left",
        bg: "white",
        width: 480,
      },

      expanded: true,

      visible: true,

      desc: parsed.desc,
    };

    dispatch({
      type: "ADD",
      payload: newEditor,
    });
  }

  return (
    <aside className="sticky top-4 self-start text-xs max-h-[90vh] w-[360px] overflow-y-auto rounded-3xl p-6 bg-secondary-t shadow-xl space-y-6">
      {/* Meta */}

      <div className="space-y-5 bg-white/5 p-4 rounded-2xl">
        <TitleInput title={title} setTitle={setTitle} />

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

        <div className="flex flex-col space-y-2">
          <p className="text-white text-sm">Created At</p>

          <input
            type="date"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            className="bg-white border rounded p-2"
          />
        </div>
      </div>

      {/* Existing Blocks */}

      <div className="space-y-4 bg-white/5 p-4 rounded-2xl">
        <h2 className="text-white font-bold text-sm uppercase tracking-widest text-center">
          Blog Elements
        </h2>

        <div className="space-y-3">
          {editors.map((editor, ind) => (
            <EditorForm
              key={ind}
              editor={editor}
              desc={editor.desc}
              index={ind}
              dispatch={dispatch}
            />
          ))}
        </div>
      </div>

      {/* Add Block */}

      <div className="space-y-3 bg-white/5 p-4 rounded-2xl">
        <h2 className="text-white font-bold text-sm uppercase tracking-widest text-center">
          Add New Element
        </h2>

        <div className="flex gap-2">
          <select
            value={selectedEditor}
            onChange={(e) => setSelectedEditor(e.target.value)}
            className="w-full rounded border p-2 bg-white text-black text-xs"
          >
            <option value="">-- Select a component --</option>

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
          </select>

          <button
            onClick={handleAddEditor}
            className="px-4 text-xs whitespace-nowrap rounded bg-white text-black border hover:bg-black hover:text-white transition-all"
          >
            Add
          </button>
        </div>
      </div>
    </aside>
  );
}
