import { useEffect, useState } from "react";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import NumberInput from "@/components/form/NumberInput";
import FileInput from "@/components/form/FileInput";
import Divider from "@/components/ui/Divider";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

function sortByNo(arr) {
  return [...arr].sort((a, b) => b.no - a.no);
}

export default function UpdateVentureForm() {
  const [ventures, setVentures] = useState([]);
  const [ventureId, setVentureId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    imageUrl: null,
    link: "",
    excerpt: "",
    no: "",
    title_th: "",
    excerpt_th: "",
    description_th: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [listLoading, setListLoading] = useState(false);
  const [showConfirmId, setShowConfirmId] = useState(null);

  async function fetchVentures() {
    setListLoading(true);
    try {
      const response = await fetch(`${apiUrl}/venture/all`);
      const result = await response.json();
      setVentures(result);
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    fetchVentures();
  }, []);

  useEffect(() => {
    if (!ventureId) return;
    async function fetchVenture() {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/venture/${ventureId}`);
        const result = await response.json();
        const venture = Array.isArray(result)
          ? result[0]
          : result.data || result;
        if (!venture) throw new Error("No venture found");
        setFormData({
          title: venture.title || "",
          excerpt: venture.excerpt || "",
          description: venture.description || "",
          image: null,
          imageUrl: venture.image || "",
          link: venture.link || "",
          no: venture.no || "",
          title_th: venture.title_th || "",
          excerpt_th: venture.excerpt_th || "",
          description_th: venture.description_th || "",
        });
        setImagePreview(venture.image || null);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load Ventures.");
      } finally {
        setLoading(false);
      }
    }
    fetchVenture();
  }, [ventureId]);

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === "file" && files.length) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
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
      Object.keys(formData).forEach((key) => {
        if (key !== "image") form.append(key, formData[key]);
      });
      if (formData.image) form.append("image", formData.image);
      const response = await fetch(`${apiUrl}/venture/${ventureId}`, {
        method: "PUT",
        body: form,
      });
      if (!response.ok) throw new Error("Update failed");
      fetchVentures();
    } catch (err) {
      console.error(err);
      setError("Error updating venture");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`${apiUrl}/venture/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      fetchVentures();
      setShowConfirmId(null);
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <div className="mx-auto flex gap-12 justify-center max-w-[1440px]">
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-xl space-y-2 bg-white border-2 text-xs"
      >
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <FileInput
          onChange={handleChange}
          value={formData.image || undefined}
          name="image"
        />
        <p>Recommended Size : 1200 x 775 px</p>
        {imagePreview && (
          <div className="relative mt-4 w-[120px] h-[120px] border rounded overflow-hidden">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}

        <Divider label="English" />
        <TextInput
          name="title"
          value={formData.title}
          onChange={handleChange}
          label="Title"
        />
        <TextInput
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          label="Short Description"
        />
        <TextArea
          name="description"
          value={formData.description}
          onChange={handleChange}
          label="Long Description"
        />

        <Divider label="ภาษาไทย" />
        <TextInput
          name="title_th"
          value={formData.title_th}
          onChange={handleChange}
          label="ชื่อ (Title TH)"
        />
        <TextInput
          name="excerpt_th"
          value={formData.excerpt_th}
          onChange={handleChange}
          label="คำอธิบายสั้น (Excerpt TH)"
        />
        <TextArea
          name="description_th"
          value={formData.description_th}
          onChange={handleChange}
          label="คำอธิบายยาว (Description TH)"
        />

        <Divider label="Other" />
        <TextInput
          label="Link"
          name="link"
          value={formData.link}
          onChange={handleChange}
        />
        <NumberInput
          label="Order"
          value={formData.no}
          onChange={handleChange}
          name="no"
        />

        <button
          type="submit"
          className="p-2 bg-secondary-t text-white rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Venture"}
        </button>
      </form>

      <Ventures
        setVentureId={setVentureId}
        data={ventures}
        loading={listLoading}
        error={error}
        handleDelete={handleDelete}
        showConfirmId={showConfirmId}
        setShowConfirmId={setShowConfirmId}
      />
    </div>
  );
}


function Ventures({
  setVentureId,
  data,
  loading,
  error,
  handleDelete,
  showConfirmId,
  setShowConfirmId,
}) {
  if (loading)
    return (
      <div className="flex flex-col items-center w-[666px]">
        <p>Loading...</p>
      </div>
    );
  if (error) return <p>Error loading ventures: {error}</p>;
  return (
    <div className="px-4 flex flex-col items-start max-w-[666px]">
      <div className="mb-4">
        <p className="text-sm tracking-wide font-thin">
          Select Venture to Edit
        </p>
      </div>
      <section className="flex gap-4 flex-wrap">
        {data?.length ? (
          sortByNo(data).map((venture) => (
            <div
              key={venture.id}
              className="flex items-center cursor-pointer p-4 rounded-full bg-white text-primary relative"
              onClick={() => setVentureId(venture.id)}
            >
              {showConfirmId === venture.id && (
                <div className="text-white absolute inset-0 flex justify-center items-center rounded-2xl z-10">
                  <div className="bg-secondary-t p-4 rounded-lg text-center space-x-4 w-full">
                    <div className="flex justify-center text-sm gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(venture.id);
                        }}
                        className="bg-secondary-r px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowConfirmId(null);
                        }}
                        className="border px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="relative size-8 mr-2">
                <img
                  src={venture.image || "/image/programs.jpg"}
                  alt={venture.title}
                  className="object-cover rounded-full size-8"
                />
              </div>
              <p className="text-xs mr-2">{venture.title}</p>
              <button
                className="bg-secondary-r p-2 rounded-full text-xs text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmId(venture.id);
                }}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No Ventures found.</p>
        )}
      </section>
    </div>
  );
}
