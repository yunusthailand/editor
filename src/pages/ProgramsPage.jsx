import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import CreateProgramForm from "./programs/CreateProgramForm";
import UpdateProgramForm from "./programs/UpdateProgramForm";

export default function ProgramsPage() {
  const [mode, setMode] = useState("create");

  return (
    <Tabs value={mode} onValueChange={setMode} asChild>
      <div className="space-y-8">
        <div className="flex flex-col space-y-8 max-w-[960px] mx-auto items-center">
          <PageHeader title="Programs" />
          <TabsList>
            <TabsTrigger value="create">Create New Program</TabsTrigger>
            <TabsTrigger value="update">Edit Program Details</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="create">
          <CreateProgramForm />
        </TabsContent>
        <TabsContent value="update">
          <UpdateProgramForm />
        </TabsContent>
      </div>
    </Tabs>
  );
}
