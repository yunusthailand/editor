export default function TitleInput({ title, setTitle }) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-white text-sm font-semibold">Blog Title</label>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your blog title..."
        className="rounded border px-3 py-2 bg-white text-black text-sm placeholder:text-gray-500"
      />
    </div>
  );
}
