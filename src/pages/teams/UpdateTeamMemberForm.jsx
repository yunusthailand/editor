import { useEffect, useState } from "react";

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
      alert("Team member updated");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Error updating member");
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
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        />
        {/*  */}
        <div className="space-y-1">
          <label>Team</label>
          <select
            name="team"
            value={formData.team}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {TEAM_OPTIONS.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <Divider label="ภาษาไทย" />
        <Input
          label="ตำแหน่ง (Role TH)"
          name="role_th"
          value={formData.role_th}
          onChange={handleChange}
        />
        <Textarea
          label="คำอธิบาย (Description TH)"
          name="description_th"
          value={formData.description_th}
          onChange={handleChange}
        />

        <Divider label="Links" />
        <Input
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

        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-secondary-t text-white rounded"
        >
          {loading ? "Updating..." : "Update Team Member"}
        </button>
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
              <button
                onClick={() => requestDelete(member)}
                className="bg-secondary-r text-white px-2 py-1 rounded text-xs"
              >
                Delete
              </button>
            </div>
          ))}
        </section>
      </div>

      {deleteTarget && (
        <DeleteMemberDialog
          target={deleteTarget}
          members={members}
          onChangeReassign={(value) =>
            setDeleteTarget((prev) => ({ ...prev, reassignTo: value }))
          }
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function DeleteMemberDialog({
  target,
  members,
  onChangeReassign,
  onCancel,
  onConfirm,
}) {
  const { member, blogCount, reassignTo, error, busy } = target;
  const candidates = members.filter((m) => m.id !== member.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl p-6 space-y-4 text-xs w-[420px]">
        <h3 className="text-lg font-light">Delete {member.name}?</h3>

        {blogCount > 0 ? (
          <>
            <p>
              This member is the author of <strong>{blogCount}</strong> blog
              post{blogCount === 1 ? "" : "s"}. Deleting them will reassign
              those posts — this cannot be undone.
            </p>
            <div className="space-y-1">
              <label className="block">Reassign their posts to</label>
              <select
                value={reassignTo}
                onChange={(e) => onChangeReassign(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">-- Select a member --</option>
                {candidates.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                    {m["is-guest"] === true ? " (placeholder)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <p>This member has not authored any blog posts.</p>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="px-4 py-2 rounded bg-secondary-r text-white disabled:opacity-50"
          >
            {busy ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-gray-400 text-[10px] uppercase tracking-widest">
        {label}
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block">{label}</label>
      <input {...props} className="w-full border rounded p-2" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block">{label}</label>
      <textarea {...props} rows={6} className="w-full border rounded p-2" />
    </div>
  );
}
