import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./context/AuthContext";

import RootLayout from "./layouts/RootLayout";

import BlogsPage from "./pages/BlogsPage";

import TeamsPage from "./pages/TeamsPage";

import VenturesPage from "./pages/VenturesPage";

import ProgramsPage from "./pages/ProgramsPage";

import LoginPage from "./pages/LoginPage";

import BlogEditor from "./pages/editor/BlogEditor";

// While the token is being verified, render nothing rather than the app shell
// or the login form — avoids a flash of either. Once anon, AuthProvider is
// already navigating to /login, so this also renders nothing in that instant.
function RequireAuth({ children }) {
  const { status } = useAuth();

  if (status !== "authed") return null;

  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <RootLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="/blogs" replace />} />

              <Route path="blogs" element={<BlogsPage />} />

              <Route path="teams" element={<TeamsPage />} />

              <Route path="ventures" element={<VenturesPage />} />

              <Route path="programs" element={<ProgramsPage />} />

              <Route path="editor" element={<BlogEditor />} />

              <Route path="editor/:blogId" element={<BlogEditor />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
