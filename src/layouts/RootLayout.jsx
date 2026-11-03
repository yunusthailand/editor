import { Outlet, NavLink, useLocation } from "react-router-dom";

import clsx from "clsx";

import { useAuth } from "@/context/AuthContext";

export default function RootLayout() {
  // The blog editor is intentionally absent from the nav — it's reached only
  // via "+ Create New Blog" (new) or a card's Edit (existing).
  const links = ["blogs", "teams", "ventures", "programs"];
  const { logout } = useAuth();

  // The editor is a workspace, not a page: the viewport is split into a fixed
  // sidebar and a preview that scroll independently, so the shell stops
  // scrolling and the nav is compacted to give the work more room.
  const isEditor = useLocation().pathname.startsWith("/editor");

  return (
    <div
      className={clsx(
        "bg-background text-primary",
        isEditor ? "flex h-screen flex-col overflow-hidden" : "min-h-screen",
      )}
    >
      {/* Navbar — teal bar spans the full viewport, links stay centered in a
          max-width container so they line up with the page content below. */}

      <nav className="shrink-0 bg-secondary text-white">
        <div
          className={clsx(
            "flex items-center justify-between gap-4 max-w-screen-lg mx-auto",
            isEditor ? "px-6 py-3" : "p-6",
          )}
        >
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

      <main className={isEditor ? "min-h-0 flex-1" : "py-8"}>
        <Outlet />
      </main>
    </div>
  );
}
