import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import Divider from "@/components/ui/Divider";
import FileInput from "@/components/form/FileInput";
import { Button } from "@/components/ui/button";
import StatusMessage from "@/components/ui/StatusMessage";

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  description: "",
  link: "",
  no: "",
  title_th: "",
  excerpt_th: "",
  description_th: "",
};

export default function CreateVentureForm() {
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  }

  const createMutation = useMutation({
    mutationFn: (form) =>
      apiFetch(`/venture/add`, { method: "POST", body: form }),
    onSuccess: () => {
      setMessage("Venture created successfully");
      formRef.current.reset();
      setFile(null);
      setImagePreview(null);
      setFormData(EMPTY_FORM);
      queryClient.invalidateQueries({ queryKey: ["ventures"] });
    },
    onError: (err) => {
      console.error(err);
      setMessage(err.message || "Error creating venture");
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
        <FileInput label="Venture Image" onChange={handleFileChange} />
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
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <Input
          label="Short Description"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
        />
        <Textarea
          label="Long Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <Divider label="ภาษาไทย" />
        <Input
          label="ชื่อ (Title TH)"
          name="title_th"
          value={formData.title_th}
          onChange={handleChange}
        />
        <Input
          label="คำอธิบายสั้น (Excerpt TH)"
          name="excerpt_th"
          value={formData.excerpt_th}
          onChange={handleChange}
        />
        <Textarea
          label="คำอธิบายยาว (Description TH)"
          name="description_th"
          value={formData.description_th}
          onChange={handleChange}
        />

        <Divider label="Other" />
        <Input
          label="Link"
          name="link"
          value={formData.link}
          onChange={handleChange}
        />
        <Input
          label="Order"
          name="no"
          type="number"
          value={formData.no}
          onChange={handleChange}
        />

        <Button type="submit" loading={loading}>
          {loading ? "Uploading..." : "Add Venture"}
        </Button>
        {message && <StatusMessage>{message}</StatusMessage>}
      </form>
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
