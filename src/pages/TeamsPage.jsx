import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import CreateTeamMemberForm from "./teams/CreateTeamMemberForm";

import UpdateTeamMemberForm from "./teams/UpdateTeamMemberForm";

export default function TeamsPage() {
  const [mode, setMode] = useState("create");

  return (
    <Tabs value={mode} onValueChange={setMode} className="space-y-8">
      <div className="flex flex-col space-y-8 max-w-[960px] mx-auto items-center">
        <PageHeader title="Team Members" />
        <TabsList>
          <TabsTrigger value="create">Create New Member</TabsTrigger>
          <TabsTrigger value="update">Edit Member Details</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="create">
        <CreateTeamMemberForm />
      </TabsContent>
      <TabsContent value="update">
        <UpdateTeamMemberForm />
      </TabsContent>
    </Tabs>
  );
}
