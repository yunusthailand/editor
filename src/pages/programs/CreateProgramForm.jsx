import { useEffect, useRef, useState } from "react";
import FileInput from "@/components/form/FileInput";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import Divider from "@/components/ui/Divider";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function CreateProgramForm() {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    description: "",
    image: null,
    link: "",
    title_th: "",
    excerpt_th: "",
    description_th: "",
  });

  useEffect(() => {
    if (!formData.image) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(formData.image);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.image]);

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
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
        if (value !== null) form.append(key, value);
      });
      const response = await fetch(`${apiUrl}/program/add`, {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error("Upload failed");
      setMessage("Program created successfully");
      setFormData({
        title: "",
        excerpt: "",
        description: "",
        image: null,
        link: "",
        title_th: "",
        excerpt_th: "",
        description_th: "",
      });
      formRef.current.reset();
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create program");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-96 mx-auto">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-6 rounded-xl space-y-2 bg-white border-2 text-xs"
      >
        <FileInput onChange={handleChange} name="image" />
        {imagePreview && (
          <div className="relative mt-4 w-[120px] h-[120px] border rounded overflow-hidden">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Divider label="English" />
        <TextInput
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextInput
          label="Short Description"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
        />
        <TextArea
          label="Long Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <Divider label="ภาษาไทย" />
        <TextInput
          label="ชื่อ (Title TH)"
          name="title_th"
          value={formData.title_th}
          onChange={handleChange}
        />
        <TextInput
          label="คำอธิบายสั้น (Excerpt TH)"
          name="excerpt_th"
          value={formData.excerpt_th}
          onChange={handleChange}
        />
        <TextArea
          label="คำอธิบายยาว (Description TH)"
          name="description_th"
          value={formData.description_th}
          onChange={handleChange}
        />

        <Divider label="Other" />
        <div className="space-y-2">
          <p className="font-bold">Links</p>
          <TextInput
            label="Link"
            name="link"
            value={formData.link}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-secondary-t text-white rounded"
        >
          {loading ? "Uploading..." : "Add Program"}
        </button>
        {message && <p className="mt-4 text-secondary-t">{message}</p>}
      </form>
    </div>
  );
}

