import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { TEAM_MEMBERS_KEY } from "@/hooks/useTeamMembers";
import Divider from "@/components/ui/Divider";
import FileInput from "@/components/form/FileInput";
import { Button } from "@/components/ui/button";
import StatusMessage from "@/components/ui/StatusMessage";

const EMPTY_FORM = {
  name: "",
  role: "",
  team: "",
  description: "",
  linkedin: "",
  role_th: "",
  description_th: "",
  isGuest: false,
};

export default function CreateTeamMemberForm() {
  const formRef = useRef(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!file) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  }

  const createMutation = useMutation({
    mutationFn: (form) =>
      apiFetch(`/team/add`, { method: "POST", body: form }),
    onSuccess: () => {
      setMessage("Team member created successfully");
      formRef.current.reset();
      setFile(null);
      setImagePreview(null);
      setFormData(EMPTY_FORM);
      // The update screen and author filter read the same cached list.
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_KEY });
    },
    onError: (err) => {
      console.error(err);
      setMessage(err.message || "Error creating member");
    },
  });

  const loading = createMutation.isPending;

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));
    if (file) form.append("image", file);
    createMutation.mutate(form);
  }

  return (
    <div className="max-w-lg mx-auto">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-6 rounded-card space-y-4 bg-white border shadow-card text-xs"
      >
        <FileInput label="Team Image" onChange={handleFileChange} />
        {imagePreview && (
          <div className="mt-4 w-[120px] h-[120px] border rounded overflow-hidden">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Divider label="English" />
        <FormInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <FormInput
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        />
        <TeamSelect value={formData.team} onChange={handleChange} />
        <FormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <Divider label="ภาษาไทย" />
        <FormInput
          label="ตำแหน่ง (Role TH)"
          name="role_th"
          value={formData.role_th}
          onChange={handleChange}
        />
        <FormTextarea
          label="คำอธิบาย (Description TH)"
          name="description_th"
          value={formData.description_th}
          onChange={handleChange}
        />

        <Divider label="Links" />
        <FormInput
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
          {loading ? "Uploading..." : "Add Team Member"}
        </Button>
        {message && <StatusMessage>{message}</StatusMessage>}
      </form>
    </div>
  );
}


function FormInput({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block font-medium">{label}</label>
      <input {...props} className="w-full border rounded p-2" />
    </div>
  );
}

function FormTextarea({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block font-medium">{label}</label>
      <textarea {...props} rows={6} className="w-full border rounded p-2" />
    </div>
  );
}

function TeamSelect(props) {
  const options = [
    "Ventures",
    "Operations",
    "Advisors",
    "Leaderships",
    "Programs",
  ];
  return (
    <div className="space-y-1">
      <label className="block font-medium">Select Team</label>
      <select {...props} name="team" className="w-full border rounded p-2">
        <option value="">Select Team</option>
        {options.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
    </div>
  );
}
