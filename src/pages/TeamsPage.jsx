import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import TabBar from "@/components/ui/TabBar";

import CreateTeamMemberForm from "./teams/CreateTeamMemberForm";

import UpdateTeamMemberForm from "./teams/UpdateTeamMemberForm";

const TABS = [
  { value: "create", label: "Create New Member" },
  { value: "update", label: "Edit Member Details" },
];

export default function TeamsPage() {
  const [mode, setMode] = useState("create");

  return (
    <main className="min-h-screen py-16 space-y-8">
      <nav className="flex flex-col pb-8 space-y-8 max-w-[960px] mx-auto items-center">
        <PageHeader title="Team Members" />
        <TabBar tabs={TABS} value={mode} onChange={setMode} />
      </nav>

      {mode === "create" && <CreateTeamMemberForm />}

      {mode === "update" && <UpdateTeamMemberForm />}
    </main>
  );
}
