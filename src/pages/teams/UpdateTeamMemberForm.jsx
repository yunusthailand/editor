import { useEffect, useState } from "react";
import Divider from "@/components/ui/Divider";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import SelectInput from "@/components/form/SelectInput";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import StatusMessage from "@/components/ui/StatusMessage";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const TEAM_OPTIONS = [
  "Ventures",
  "Operations",
  "Advisors",
  "Leaderships",
  "Programs",
];

export default function UpdateTeamMemberForm() {
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
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
  });

  async function fetchMembers() {
    try {
      // Hidden members must stay editable here even though they're off the
      // public roster — otherwise the placeholder author can't be managed.
      const response = await fetch(`${apiUrl}/team/all?includeHidden=true`);
      const result = await response.json();
      setMembers(result);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    async function fetchMember() {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/team/${selectedId}`);
        const result = await response.json();
        const member = result?.[0];
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
      } catch (err) {
        console.error(err);
        setError("Failed to load member");
      } finally {
        setLoading(false);
      }
    }
    fetchMember();
  }, [selectedId]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) form.append(key, value);
      });
      const response = await fetch(`${apiUrl}/team/${selectedId}`, {
        method: "PUT",
        body: form,
      });
      if (!response.ok) throw new Error("Update failed");
      setStatus({ kind: "success", text: "Team member updated" });
      fetchMembers();
    } catch (err) {
      console.error(err);
      setStatus({ kind: "error", text: err.message || "Error updating member" });
    } finally {
      setLoading(false);
    }
  }

  // Deleting a member reassigns everything they wrote, so the count is fetched
  // and shown before the admin commits to it.
  async function requestDelete(member) {
    try {
      const response = await fetch(`${apiUrl}/team/${member.id}/blog-count`);
      if (!response.ok) throw new Error("Could not check authored blogs");
      const { count } = await response.json();

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

  async function confirmDelete() {
    const { member, blogCount, reassignTo } = deleteTarget;

    if (blogCount > 0 && !reassignTo) {
      setDeleteTarget((prev) => ({
        ...prev,
        error: "Choose someone to reassign these posts to.",
      }));
      return;
    }

    setDeleteTarget((prev) => ({ ...prev, busy: true, error: "" }));

    try {
      const url = new URL(`${apiUrl}/team/${member.id}`);
      if (blogCount > 0) url.searchParams.set("reassignTo", reassignTo);

      const response = await fetch(url, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));

      // The server's 409s carry the actionable text — surface it rather than
      // collapsing every failure into a generic message.
      if (!response.ok) {
        throw new Error(result.message || `Delete failed (${response.status})`);
      }

      setDeleteTarget(null);
      fetchMembers();
      if (selectedId === member.id) setSelectedId(null);
    } catch (err) {
      console.error(err);
      setDeleteTarget((prev) => ({
        ...prev,
        busy: false,
        error: err.message || "Delete failed",
      }));
    }
  }

  return (
    <div className="mx-auto flex gap-12 justify-center max-w-[1440px]">
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-xl space-y-4 bg-white border-2 text-xs w-[420px]"
      >
        <h2 className="text-2xl font-light">Edit Team Member</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          name="image"
        />
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
          {members.map((member) => (
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
                {member["is-guest"] === true && (
                  <span className="text-[10px] uppercase tracking-wide text-gray-400">
                    hidden
                  </span>
                )}
              </button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => requestDelete(member)}
              >
                Delete
              </Button>
            </div>
          ))}
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
                className="w-full border rounded-control p-2"
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

