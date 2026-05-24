export default function TitleInput({
  title,
  setTitle,
  title_th,
  setTitleTh,
  lang,
}) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-white text-sm font-semibold">
        Blog Title{" "}
        {lang === "th" && (
          <span className="text-yellow-300 text-[10px]">TH</span>
        )}
      </label>
      {lang === "th" ? (
        <input
          type="text"
          value={title_th}
          onChange={(e) => setTitleTh(e.target.value)}
          placeholder="ชื่อบล็อกภาษาไทย..."
          className="rounded border px-3 py-2 bg-white text-black text-sm placeholder:text-gray-500"
        />
      ) : (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title..."
          className="rounded border px-3 py-2 bg-white text-black text-sm placeholder:text-gray-500"
        />
      )}
    </div>
  );
}
