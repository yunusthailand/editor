import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useTeamMembers, TEAM_MEMBERS_KEY } from "@/hooks/useTeamMembers";
import Divider from "@/components/ui/Divider";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import SelectInput from "@/components/form/SelectInput";
import FileInput from "@/components/form/FileInput";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import StatusMessage from "@/components/ui/StatusMessage";

const TEAM_OPTIONS = [
  "Ventures",
  "Operations",
  "Advisors",
  "Leaderships",
  "Programs",
];

const EMPTY_FORM = {
  name: "",
  role: "",
  team: "",
  description: "",
  image: null,
  linkedin: "",
  youtube: "",
  role_th: "",
  description_th: "",
  isGuest: false,
};

export default function UpdateTeamMemberForm() {
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const queryClient = useQueryClient();

  // Shared with the blog author filter — one cached member list, refreshed by
  // the mutations below.
  const { data: members = [] } = useTeamMembers();

  const {
    data: selectedMember,
    isFetching: memberLoading,
    isError: memberError,
  } = useQuery({
    queryKey: ["team-member", selectedId],
    queryFn: () => apiFetch(`/team/${selectedId}`),
    enabled: !!selectedId,
  });

  // The query owns the server copy; the form owns an editable draft. Hydrate the
  // draft whenever a freshly-fetched member arrives — the one place these two
  // need syncing, which is exactly what an effect is for.
  useEffect(() => {
    if (!selectedId) return;
    if (memberError) {
      setError("Failed to load member");
      return;
    }
    if (!selectedMember) return;
    const member = selectedMember[0];
    if (!member) {
      setError("Member not found");
      return;
    }
    setFormData({
      name: member.name || "",
      role: member.role || "",
      team: member.team || "",
      description: member.description || "",
      image: null,
      linkedin: member.links?.[0]?.url || "",
      youtube: member.links?.[1]?.url || "",
      role_th: member.role_th || "",
      description_th: member.description_th || "",
      isGuest: member["is-guest"] === true,
    });
    setImagePreview(member.image || null);
    setError("");
  }, [selectedMember, selectedId, memberError]);

  function handleChange(e) {
    const { name, value, type, files, checked } = e.target;
    if (type === "file" && files.length) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      return;
    }
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const updateMutation = useMutation({
    mutationFn: (form) =>
      apiFetch(`/team/${selectedId}`, { method: "PUT", body: form }),
    onSuccess: () => {
      setStatus({ kind: "success", text: "Team member updated" });
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_KEY });
      queryClient.invalidateQueries({ queryKey: ["team-member", selectedId] });
    },
    onError: (err) =>
      setStatus({ kind: "error", text: err.message || "Error updating member" }),
  });

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) form.append(key, value);
    });
    updateMutation.mutate(form);
  }

  // Deleting a member reassigns everything they wrote, so the count is fetched
  // and shown before the admin commits to it.
  async function requestDelete(member) {
    try {
      const { count } = await apiFetch(`/team/${member.id}/blog-count`);

      const fallback = members.find(
        (m) => m["is-guest"] === true && m.id !== member.id,
      );

      setDeleteTarget({
        member,
        blogCount: count,
        reassignTo: fallback ? String(fallback.id) : "",
        error: "",
        busy: false,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not check authored blogs");
    }
  }

  const deleteMutation = useMutation({
    mutationFn: ({ member, blogCount, reassignTo }) => {
      const qs =
        blogCount > 0 ? `?reassignTo=${encodeURIComponent(reassignTo)}` : "";
      return apiFetch(`/team/${member.id}${qs}`, { method: "DELETE" });
    },
    onSuccess: (_data, { member }) => {
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_KEY });
      // Reassignment rewrote blog authors, so the blog list is now stale.
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      if (selectedId === member.id) setSelectedId(null);
    },
    // The server's 409s carry the actionable text — surface it rather than
    // collapsing every failure into a generic message.
    onError: (err) =>
      setDeleteTarget((prev) =>
        prev ? { ...prev, busy: false, error: err.message || "Delete failed" } : prev,
      ),
  });

  function confirmDelete() {
    const { blogCount, reassignTo } = deleteTarget;

    if (blogCount > 0 && !reassignTo) {
      setDeleteTarget((prev) => ({
        ...prev,
        error: "Choose someone to reassign these posts to.",
      }));
      return;
    }

    setDeleteTarget((prev) => ({ ...prev, busy: true, error: "" }));
    deleteMutation.mutate(deleteTarget);
  }

  const loading = memberLoading || updateMutation.isPending;

  return (
    <div className="mx-auto flex gap-12 justify-center max-w-[1440px]">
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-card space-y-4 bg-white border shadow-card text-xs w-[480px]"
      >
        <h2 className="text-2xl font-light">Edit Team Member</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}

        <FileInput label="Team Image" onChange={handleChange} />
        {imagePreview && (
          <div className="w-[120px] h-[120px] border rounded overflow-hidden">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Divider label="English" />
        <TextInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextInput
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        />
        <SelectInput
          label="Team"
          name="team"
          value={formData.team}
          onChange={handleChange}
          options={TEAM_OPTIONS}
        />
        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <Divider label="ภาษาไทย" />
        <TextInput
          label="ตำแหน่ง (Role TH)"
          name="role_th"
          value={formData.role_th}
          onChange={handleChange}
        />
        <TextArea
          label="คำอธิบาย (Description TH)"
          name="description_th"
          value={formData.description_th}
          onChange={handleChange}
        />

        <Divider label="Links" />
        <TextInput
          label="LinkedIn"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
        />

        <Divider label="Visibility" />
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            name="isGuest"
            checked={formData.isGuest}
            onChange={handleChange}
            className="mt-0.5"
          />
          <span>
            Hide from public team page
            <span className="block text-gray-400">
              Use for placeholder authors such as “Yunus Team”. They can still
              be credited on blog posts.
            </span>
          </span>
        </label>

        <Button type="submit" loading={loading}>
          {loading ? "Updating..." : "Update Team Member"}
        </Button>
        {status && (
          <StatusMessage kind={status.kind}>{status.text}</StatusMessage>
        )}
      </form>

      <div className="max-w-[666px] space-y-4">
        <p className="text-xl font-light">Select Member</p>
        <section className="flex gap-4 flex-wrap">
          {/* Hidden placeholder authors (is-guest) are listed too: they have to
              stay editable — renaming one, or un-hiding it, is the only way to
              make it deletable, since the server refuses to delete a hidden
              member. */}
          {members.map((member) => {
            const hidden = member["is-guest"] === true;
            return (
              <div
                key={member.id}
                className="flex items-center gap-2 bg-white p-3 rounded-full border"
              >
                <button
                  onClick={() => setSelectedId(member.id)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="size-8 rounded-full object-cover"
                  />
                  <span className="text-xs">{member.name}</span>
                  {hidden && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                      Hidden
                    </span>
                  )}
                </button>
                <span
                  title={hidden ? "Un-hide this member before deleting" : undefined}
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={hidden}
                    onClick={() => requestDelete(member)}
                  >
                    Delete
                  </Button>
                </span>
              </div>
            );
          })}
        </section>
      </div>

      {deleteTarget && (
        <ConfirmDialog
          danger
          title={`Delete ${deleteTarget.member.name}?`}
          message={
            deleteTarget.blogCount > 0
              ? `This member is the author of ${deleteTarget.blogCount} blog post${deleteTarget.blogCount === 1 ? "" : "s"}. Deleting them will reassign those posts — this cannot be undone.`
              : "This member has not authored any blog posts."
          }
          confirmLabel="Delete"
          busy={deleteTarget.busy}
          error={deleteTarget.error}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        >
          {deleteTarget.blogCount > 0 && (
            <div className="space-y-1">
              <label className="block">Reassign their posts to</label>
              <select
                value={deleteTarget.reassignTo}
                onChange={(e) =>
                  setDeleteTarget((prev) => ({
                    ...prev,
                    reassignTo: e.target.value,
                  }))
                }
                className="h-9 w-full rounded-control border border-primary/30 bg-white px-3 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
              >
                <option value="">-- Select a member --</option>
                {members
                  .filter((m) => m.id !== deleteTarget.member.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                      {m["is-guest"] === true ? " (placeholder)" : ""}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </ConfirmDialog>
      )}
    </div>
  );
}

