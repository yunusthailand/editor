import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function MemberInput({ author, setAuthor }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function getMembers() {
      try {
        const response = await fetch(`${apiUrl}/team/all`);

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
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-white text-sm font-semibold">Select Author</label>

      <select
        value={author?.id || ""}
        onChange={handleSelect}
        className="rounded border px-3 py-2 bg-white text-black text-sm"
      >
        <option value="">-- Select an Author --</option>

        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
    </div>
  );
}
