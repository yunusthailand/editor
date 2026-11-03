import { useId } from "react";
import { Field, SelectField } from "./EditorField";

export default function CategoryInput({
  category,
  setCategory,
  subcategory,
  setSubcategory,
}) {
  const categoryId = useId();
  const subcategoryId = useId();

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
    <div className="space-y-4">
      <Field label="Category" htmlFor={categoryId}>
        <SelectField
          id={categoryId}
          value={category}
          onChange={handleSetCategory}
        >
          <option value="">Select a category</option>
          <option value="perspectives">Perspectives</option>
          <option value="knowledge">Knowledge</option>
        </SelectField>
      </Field>

      <Field
        label="Subcategory"
        htmlFor={subcategoryId}
        hint="Choosing one files the post under Knowledge."
      >
        <SelectField
          id={subcategoryId}
          value={subcategory}
          onChange={handleSetSubcategory}
        >
          <option value="">Select a subcategory</option>
          <option value="publication">Publication</option>
          <option value="press-release">Press Release</option>
          <option value="case-studies">Case Studies</option>
          <option value="toolkit">Toolkit</option>
          <option value="videos">Videos</option>
        </SelectField>
      </Field>
    </div>
  );
}
