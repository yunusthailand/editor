import { Outlet, NavLink } from "react-router-dom";

import clsx from "clsx";

export default function RootLayout() {
  // "editor" included so the blog editor is reachable from the nav; NavLink
  // also marks it active on /editor/:blogId, which is what we want.
  const links = ["blogs", "teams", "ventures", "programs", "editor"];

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Navbar */}

      <nav className="pt-8 max-w-screen-lg rounded-card overflow-hidden mx-auto">
        <ol className="flex gap-4 bg-secondary text-white p-8 justify-center">
          {links.map((link) => (
            <li key={link}>
              <NavLink
                to={`/${link}`}
                className={({ isActive }) =>
                  clsx(
                    "px-6 py-2 rounded-control border transition-all hover:scale-105 capitalize block",
                    // The inactive border used to be unset, so it fell back to
                    // Tailwind's grey default and vanished against the teal.
                    isActive
                      ? "bg-white text-primary border-white scale-105"
                      : "border-white/40 hover:bg-white/10",
                  )
                }
              >
                {link}
              </NavLink>
            </li>
          ))}
        </ol>
      </nav>

      {/* Page Content */}

      <main className="py-8">
        <Outlet />
      </main>
    </div>
  );
}
