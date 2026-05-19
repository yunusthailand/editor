import { Outlet } from "react-router-dom";
import { AdminProvider } from "../context/AdminContext";

export default function AdminLayout() {
  return (
    <AdminProvider>
      <Outlet />
    </AdminProvider>
  );
}
