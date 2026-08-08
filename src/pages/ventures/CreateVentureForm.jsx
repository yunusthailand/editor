import { useEffect, useRef, useState } from "react";
import Divider from "@/components/ui/Divider";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function CreateVentureForm() {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    description: "",
    link: "",
    no: "",
    title_th: "",
    excerpt_th: "",
    description_th: "",
  });

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

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        form.append(key, value),
      );
      if (file) form.append("image", file);
      const response = await fetch(`${apiUrl}/venture/add`, {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error("Failed to create venture");
      setMessage("Venture created successfully");
      formRef.current.reset();
      setFile(null);
      setImagePreview(null);
      setFormData({
        title: "",
        excerpt: "",
        description: "",
        link: "",
        no: "",
        title_th: "",
        excerpt_th: "",
        description_th: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("Error creating venture");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-96 mx-auto">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-6 rounded-xl space-y-4 bg-white border-2 text-xs"
      >
        <input type="file" accept="image/*" onChange={handleFileChange} />
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

        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-secondary-t text-white rounded"
        >
          {loading ? "Uploading..." : "Add Venture"}
        </button>
        {message && <p className="text-secondary-t">{message}</p>}
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
