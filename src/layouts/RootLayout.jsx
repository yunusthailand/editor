import { Outlet, NavLink } from "react-router-dom";

import clsx from "clsx";

export default function RootLayout() {
  const links = ["blogs", "teams", "ventures", "programs"];

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Navbar */}

      <nav className="pt-8 max-w-screen-lg rounded-xl overflow-hidden mx-auto">
        <ol className="flex gap-8 bg-secondary-t text-white p-8 justify-center">
          {links.map((link) => (
            <li key={link}>
              <NavLink
                to={`/${link}`}
                className={({ isActive }) =>
                  clsx(
                    "px-6 py-2 rounded-xl border transition-all hover:scale-105 capitalize",

                    isActive && "bg-white text-primary scale-110",
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
