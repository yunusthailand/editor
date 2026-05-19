import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";

import BlogsPage from "./pages/BlogsPage";

import TeamsPage from "./pages/TeamsPage";

import VenturesPage from "./pages/VenturesPage";

import ProgramsPage from "./pages/ProgramsPage";

import LoginPage from "./pages/LoginPage";

import BlogEditor from "./pages/editor/BlogEditor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
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
    </BrowserRouter>
  );
}
