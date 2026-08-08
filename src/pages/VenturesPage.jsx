import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import TabBar from "@/components/ui/TabBar";

import CreateVentureForm from "./ventures/CreateVentureForm";
import UpdateVentureForm from "./ventures/UpdateVentureForm";

const TABS = [
  { value: "create", label: "Create New Venture" },
  { value: "update", label: "Edit Venture Details" },
];

export default function VenturesPage() {
  const [mode, setMode] = useState("create");

  return (
    <main className="min-h-screen py-16 space-y-8">
      <nav className="flex flex-col pb-8 space-y-8 max-w-[960px] mx-auto items-center">
        <PageHeader title="Ventures" />
        <TabBar tabs={TABS} value={mode} onChange={setMode} />
      </nav>

      {mode === "create" && <CreateVentureForm />}

      {mode === "update" && <UpdateVentureForm />}
    </main>
  );
}
