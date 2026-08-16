import { Outlet, NavLink } from "react-router-dom";

import clsx from "clsx";

import { useAuth } from "@/context/AuthContext";

export default function RootLayout() {
  // The blog editor is intentionally absent from the nav — it's reached only
  // via "+ Create New Blog" (new) or a card's Edit (existing).
  const links = ["blogs", "teams", "ventures", "programs"];
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Navbar — teal bar spans the full viewport, links stay centered in a
          max-width container so they line up with the page content below. */}

      <nav className="bg-secondary text-white">
        <div className="flex items-center justify-between gap-4 p-6 max-w-screen-lg mx-auto">
          {/* Balances the Logout control so the links stay visually centered. */}
          <span className="w-16 hidden sm:block" aria-hidden="true" />

          <ol className="flex gap-4 justify-center">
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

          <button
            onClick={logout}
            className="w-16 text-sm text-white/80 hover:text-white hover:underline underline-offset-2 text-right"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Page Content */}

      <main className="py-8">
        <Outlet />
      </main>
    </div>
  );
}
