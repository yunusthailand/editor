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

export default function UpdateProgramForm() {
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState(null);
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

  async function fetchPrograms() {
    setListLoading(true);
    try {
      const response = await fetch(`${apiUrl}/program/all`);
      const result = await response.json();
      setPrograms(result);
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (!programId) return;
    async function fetchProgram() {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/program/${programId}`);
        const result = await response.json();
        const program = Array.isArray(result)
          ? result[0]
          : result.data || result;
        if (!program) throw new Error("No program found");
        setFormData({
          title: program.title || "",
          excerpt: program.excerpt || "",
          description: program.description || "",
          image: null,
          imageUrl: program.image || "",
          link: program.link || "",
          no: program.no || "",
          title_th: program.title_th || "",
          excerpt_th: program.excerpt_th || "",
          description_th: program.description_th || "",
        });
        setImagePreview(program.image || null);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load Programs.");
      } finally {
        setLoading(false);
      }
    }
    fetchProgram();
  }, [programId]);

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
      const response = await fetch(`${apiUrl}/program/${programId}`, {
        method: "PUT",
        body: form,
      });
      if (!response.ok) throw new Error("Update failed");
      fetchPrograms();
    } catch (err) {
      console.error(err);
      setError("Error updating program");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`${apiUrl}/program/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      fetchPrograms();
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
          {loading ? "Updating..." : "Update Program"}
        </button>
      </form>

      <Programs
        setProgramId={setProgramId}
        data={programs}
        loading={listLoading}
        error={error}
        handleDelete={handleDelete}
        showConfirmId={showConfirmId}
        setShowConfirmId={setShowConfirmId}
      />
    </div>
  );
}


function Programs({
  setProgramId,
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
  if (error) return <p>Error loading programs: {error}</p>;
  return (
    <div className="px-4 flex flex-col items-start max-w-[666px]">
      <div className="mb-4">
        <p className="text-sm tracking-wide font-thin">
          Select Program to Edit
        </p>
      </div>
      <section className="flex gap-4 flex-wrap">
        {data?.length ? (
          sortByNo(data).map((program) => (
            <div
              key={program.id}
              className="flex items-center cursor-pointer p-4 rounded-full bg-white text-primary relative"
              onClick={() => setProgramId(program.id)}
            >
              {showConfirmId === program.id && (
                <div className="text-white absolute inset-0 flex justify-center items-center rounded-2xl z-10">
                  <div className="bg-secondary-t p-4 rounded-lg text-center space-x-4 w-full">
                    <div className="flex justify-center text-sm gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(program.id);
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
                  src={program.image || "/image/programs.jpg"}
                  alt={program.title}
                  className="object-cover rounded-full size-8"
                />
              </div>
              <p className="text-xs mr-2">{program.title}</p>
              <button
                className="bg-secondary-r p-2 rounded-full text-xs text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmId(program.id);
                }}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No Programs found.</p>
        )}
      </section>
    </div>
  );
}
