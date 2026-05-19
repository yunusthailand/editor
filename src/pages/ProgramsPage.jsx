import { useState } from "react";

import clsx from "clsx";

import CreateProgramForm from "./programs/CreateProgramForm";
import UpdateProgramForm from "./programs/UpdateProgramForm";

export default function ProgramsPage() {
  const [mode, setMode] = useState("create");

  return (
    <main className="min-h-screen py-16 space-y-8">
      <ProgramBar mode={mode} setMode={setMode} />

      {mode === "create" && <CreateProgramForm />}

      {mode === "update" && <UpdateProgramForm />}
    </main>
  );
}

function ProgramBar({ mode, setMode }) {
  return (
    <nav className="flex flex-col pb-8 space-y-8 w-[960px] mx-auto items-center">
      <h1 className="text-5xl font-thin tracking-wider">Programs</h1>

      <ol className="flex space-x-2 justify-center">
        {["create", "update"].map((act) => (
          <li
            key={act}
            className={clsx(
              "px-4 py-2 rounded-lg border transition-all",

              act === mode && "bg-secondary-t text-white scale-105",
            )}
          >
            <button onClick={() => setMode(act)}>
              {act === "update" ? "Edit Program Details" : "Create New Program"}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
