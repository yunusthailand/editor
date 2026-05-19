import clsx from "clsx";

export default function VideoEmbed({ load, config }) {
  const { text: youtubeUrl } = load;

  const { align, bg } = config;

  const videoIdMatch = youtubeUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([^?&]+)/,
  );

  const videoId = videoIdMatch?.[1];

  if (!videoId) {
    return <p className="text-red-500 text-center">Invalid YouTube URL</p>;
  }

  return (
    <div
      className={clsx(
        "w-full flex py-6 px-4 lg:px-16",

        align === "center" && "justify-center",

        align === "left" && "justify-start",

        align === "right" && "justify-end",
      )}
      style={{
        backgroundColor: bg === "white" ? "transparent" : bg,
      }}
    >
      <iframe
        className="aspect-video w-full border-none max-w-4xl"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Embedded YouTube Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
