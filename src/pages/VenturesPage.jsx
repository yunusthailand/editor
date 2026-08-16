import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import CreateVentureForm from "./ventures/CreateVentureForm";
import UpdateVentureForm from "./ventures/UpdateVentureForm";

export default function VenturesPage() {
  const [mode, setMode] = useState("create");

  return (
    <Tabs value={mode} onValueChange={setMode} asChild>
      <div className="space-y-8">
        <div className="flex flex-col space-y-8 max-w-[960px] mx-auto items-center">
          <PageHeader title="Ventures" />
          <TabsList>
            <TabsTrigger value="create">Create New Venture</TabsTrigger>
            <TabsTrigger value="update">Edit Venture Details</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="create">
          <CreateVentureForm />
        </TabsContent>
        <TabsContent value="update">
          <UpdateVentureForm />
        </TabsContent>
      </div>
    </Tabs>
  );
}
