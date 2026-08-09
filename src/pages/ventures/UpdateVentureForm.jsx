import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import NumberInput from "@/components/form/NumberInput";
import FileInput from "@/components/form/FileInput";
import Divider from "@/components/ui/Divider";

const VENTURES_KEY = ["ventures"];

function sortByNo(arr) {
  return [...arr].sort((a, b) => b.no - a.no);
}

const EMPTY_FORM = {
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
};

export default function UpdateVentureForm() {
  const [ventureId, setVentureId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showConfirmId, setShowConfirmId] = useState(null);

  const queryClient = useQueryClient();

  const { data: ventures = [], isFetching: listLoading } = useQuery({
    queryKey: VENTURES_KEY,
    queryFn: () => apiFetch(`/venture/all`),
  });

  const {
    data: ventureData,
    isFetching: itemLoading,
    isError: itemError,
  } = useQuery({
    queryKey: ["venture", ventureId],
    queryFn: () => apiFetch(`/venture/${ventureId}`),
    enabled: !!ventureId,
  });

  // Hydrate the editable draft when a freshly-fetched venture arrives.
  useEffect(() => {
    if (!ventureId) return;
    if (itemError) {
      setError("Failed to load Ventures.");
      return;
    }
    if (!ventureData) return;
    const venture = Array.isArray(ventureData)
      ? ventureData[0]
      : ventureData.data || ventureData;
    if (!venture) {
      setError("Failed to load Ventures.");
      return;
    }
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
  }, [ventureData, ventureId, itemError]);

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

  const updateMutation = useMutation({
    mutationFn: (form) =>
      apiFetch(`/venture/${ventureId}`, { method: "PUT", body: form }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VENTURES_KEY }),
    onError: () => setError("Error updating venture"),
  });

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "image") form.append(key, formData[key]);
    });
    if (formData.image) form.append("image", formData.image);
    updateMutation.mutate(form);
  }

  const deleteMutation = useMutation({
    mutationFn: (id) => apiFetch(`/venture/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENTURES_KEY });
      setShowConfirmId(null);
    },
    onError: (err) => console.error("Error:", err),
  });

  function handleDelete(id) {
    deleteMutation.mutate(id);
  }

  const loading = itemLoading || updateMutation.isPending;

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
