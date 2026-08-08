import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import TabBar from "@/components/ui/TabBar";

import CreateProgramForm from "./programs/CreateProgramForm";
import UpdateProgramForm from "./programs/UpdateProgramForm";

const TABS = [
  { value: "create", label: "Create New Program" },
  { value: "update", label: "Edit Program Details" },
];

export default function ProgramsPage() {
  const [mode, setMode] = useState("create");

  return (
    <main className="min-h-screen py-16 space-y-8">
      <nav className="flex flex-col pb-8 space-y-8 max-w-[960px] mx-auto items-center">
        <PageHeader title="Programs" />
        <TabBar tabs={TABS} value={mode} onChange={setMode} />
      </nav>

      {mode === "create" && <CreateProgramForm />}

      {mode === "update" && <UpdateProgramForm />}
    </main>
  );
}
