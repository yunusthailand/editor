import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import TextInput from "@/components/form/TextInput";
import TextArea from "@/components/form/TextArea";
import NumberInput from "@/components/form/NumberInput";
import FileInput from "@/components/form/FileInput";
import Divider from "@/components/ui/Divider";
import { Button } from "@/components/ui/button";

const PROGRAMS_KEY = ["programs"];

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

export default function UpdateProgramForm() {
  const [programId, setProgramId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showConfirmId, setShowConfirmId] = useState(null);

  const queryClient = useQueryClient();

  const { data: programs = [], isFetching: listLoading } = useQuery({
    queryKey: PROGRAMS_KEY,
    queryFn: () => apiFetch(`/program/all`),
  });

  const {
    data: programData,
    isFetching: itemLoading,
    isError: itemError,
  } = useQuery({
    queryKey: ["program", programId],
    queryFn: () => apiFetch(`/program/${programId}`),
    enabled: !!programId,
  });

  // Hydrate the editable draft when a freshly-fetched program arrives.
  useEffect(() => {
    if (!programId) return;
    if (itemError) {
      setError("Failed to load Programs.");
      return;
    }
    if (!programData) return;
    const program = Array.isArray(programData)
      ? programData[0]
      : programData.data || programData;
    if (!program) {
      setError("Failed to load Programs.");
      return;
    }
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
  }, [programData, programId, itemError]);

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
      apiFetch(`/program/${programId}`, { method: "PUT", body: form }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROGRAMS_KEY }),
    onError: () => setError("Error updating program"),
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
    mutationFn: (id) => apiFetch(`/program/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRAMS_KEY });
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
        className="p-6 rounded-card space-y-2 bg-white border shadow-card text-xs"
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

        <Button type="submit" loading={loading}>
          {loading ? "Updating..." : "Update Program"}
        </Button>
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
                <div className="absolute inset-0 flex justify-center items-center rounded-card bg-white/95 border shadow-card z-10">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(program.id);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowConfirmId(null);
                      }}
                    >
                      Cancel
                    </Button>
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
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmId(program.id);
                }}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p>No Programs found.</p>
        )}
      </section>
    </div>
  );
}
