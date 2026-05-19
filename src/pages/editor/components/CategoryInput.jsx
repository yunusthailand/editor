export default function CategoryInput({
  category,
  setCategory,
  subcategory,
  setSubcategory,
}) {
  function handleSetCategory(e) {
    const value = e.target.value;

    if (value === "perspectives") {
      setSubcategory("");
    }

    setCategory(value);
  }

  function handleSetSubcategory(e) {
    setSubcategory(e.target.value);

    setCategory("knowledge");
  }

  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-white text-sm font-semibold">Category</label>

      <select
        value={category}
        onChange={handleSetCategory}
        className="rounded border px-3 py-2 bg-white text-black text-sm"
      >
        <option value="">-- Select a Category --</option>

        <option value="perspectives">Perspectives</option>

        <option value="knowledge">Knowledge</option>
      </select>

      <label className="text-white text-sm font-semibold">Subcategory</label>

      <select
        value={subcategory}
        onChange={handleSetSubcategory}
        className="rounded border px-3 py-2 bg-white text-black text-sm"
      >
        <option value="">-- Select a Subcategory --</option>

        <option value="publication">Publication</option>

        <option value="press-release">Press Release</option>

        <option value="case-studies">Case Studies</option>

        <option value="toolkit">Toolkit</option>

        <option value="videos">Videos</option>
      </select>
    </div>
  );
}
