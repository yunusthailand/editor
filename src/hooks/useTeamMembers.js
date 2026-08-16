import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

// Shared across the blog author filter, the editor's author picker and the
// team-management screen. One query key means one cached fetch: they all read
// the same list, and a mutation anywhere can refresh every consumer at once.
//
// includeHidden defaults on because every in-editor consumer needs the
// placeholder authors that are filtered off the public roster; only the public
// site wants them hidden, and it doesn't use this hook.
export function useTeamMembers({ includeHidden = true } = {}) {
  return useQuery({
    queryKey: ["team-members", { includeHidden }],
    queryFn: () =>
      apiFetch(`/team/all${includeHidden ? "?includeHidden=true" : ""}`),
  });
}

export const TEAM_MEMBERS_KEY = ["team-members"];
