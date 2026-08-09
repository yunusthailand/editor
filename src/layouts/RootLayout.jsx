import { Outlet, NavLink } from "react-router-dom";

import clsx from "clsx";

export default function RootLayout() {
  // The blog editor is intentionally absent from the nav — it's reached only
  // via "+ Create New Blog" (new) or a card's Edit (existing).
  const links = ["blogs", "teams", "ventures", "programs"];

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Navbar — teal bar spans the full viewport, links stay centered in a
          max-width container so they line up with the page content below. */}

      <nav className="bg-secondary text-white">
        <ol className="flex gap-4 p-6 justify-center max-w-screen-lg mx-auto">
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
