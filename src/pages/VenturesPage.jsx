import { useState } from "react";

import clsx from "clsx";

import CreateVentureForm from "./ventures/CreateVentureForm";
import UpdateVentureForm from "./ventures/UpdateVentureForm";

export default function VenturesPage() {
  const [mode, setMode] = useState("create");

  return (
    <main className="min-h-screen py-16 space-y-8">
      <VentureBar mode={mode} setMode={setMode} />

      {mode === "create" && <CreateVentureForm />}

      {mode === "update" && <UpdateVentureForm />}
    </main>
  );
}

function VentureBar({ mode, setMode }) {
  return (
    <nav className="flex flex-col pb-8 space-y-8 w-[960px] mx-auto items-center">
      <h1 className="text-5xl font-thin tracking-wider">Ventures</h1>

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
              {act === "update" ? "Edit Venture Details" : "Create New Venture"}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
