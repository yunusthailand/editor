import { useEffect, useId, useState } from "react";
import { Field, SelectField } from "./EditorField";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function MemberInput({ author, setAuthor }) {
  const [members, setMembers] = useState([]);
  const id = useId();

  useEffect(() => {
    async function getMembers() {
      try {
        // includeHidden so placeholder authors such as "Yunus Team" can be
        // credited on a post even though they're off the public roster.
        const response = await fetch(`${apiUrl}/team/all?includeHidden=true`);

        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }

        const result = await response.json();

        setMembers(result);
      } catch (err) {
        console.error(err);
      }
    }

    getMembers();
  }, []);

  function handleSelect(e) {
    const selectedMember = members.find((m) => m.id === Number(e.target.value));

    setAuthor(selectedMember);
  }

  return (
    <Field label="Author" htmlFor={id}>
      <SelectField id={id} value={author?.id || ""} onChange={handleSelect}>
        <option value="">Select an author</option>

        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </SelectField>
    </Field>
  );
}
