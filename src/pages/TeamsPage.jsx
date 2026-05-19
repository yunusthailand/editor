import { useState } from "react";

import clsx from "clsx";

import CreateTeamMemberForm from "./teams/CreateTeamMemberForm";

import UpdateTeamMemberForm from "./teams/UpdateTeamMemberForm";

export default function TeamsPage() {
  const [mode, setMode] = useState("create");

  return (
    <main className="min-h-screen py-16 space-y-8">
      <TeamBar mode={mode} setMode={setMode} />

      {mode === "create" && <CreateTeamMemberForm />}

      {mode === "update" && <UpdateTeamMemberForm />}
    </main>
  );
}

function TeamBar({ mode, setMode }) {
  return (
    <nav className="flex flex-col pb-8 space-y-8 w-[960px] mx-auto items-center">
      <BigText text="Team Members" />

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
              <SmallText
                text={
                  act === "update" ? "Edit Member Details" : "Create New Member"
                }
              />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function BigText({ text }) {
  return <p className="text-5xl font-thin tracking-wider">{text}</p>;
}

export function MidText({ text }) {
  return <p className="text-lg tracking-wide font-thin">{text}</p>;
}

export function SmallText({ text }) {
  return <p className="text-sm tracking-wide font-thin">{text}</p>;
}
