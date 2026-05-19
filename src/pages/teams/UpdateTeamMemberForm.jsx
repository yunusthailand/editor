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
  });

  async function fetchMembers() {
    try {
      const response = await fetch(`${apiUrl}/team/all`);
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
    const { name, value, type, files } = e.target;
    if (type === "file" && files.length) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
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

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this member?");
    if (!confirmed) return;
    try {
      const response = await fetch(`${apiUrl}/team/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      fetchMembers();
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      console.error(err);
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
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="bg-secondary-r text-white px-2 py-1 rounded text-xs"
              >
                Delete
              </button>
            </div>
          ))}
        </section>
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
