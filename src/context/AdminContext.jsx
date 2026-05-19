import { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const value = {
    selectedBlog,
    setSelectedBlog,

    isPreviewMode,
    setIsPreviewMode,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }

  return context;
}
