import { useEffect, useState } from "react";

import renderBlock from "./renderers/renderBlock";

import { formatHead } from "@/utils/helpers";

export default function PreviewPanel({
  editors,
  title,
  headerImage,
  author,
  blogDate,
  blogId,
  category,
  subcategory,
}) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (headerImage instanceof File) {
      const objectUrl = URL.createObjectURL(headerImage);

      setSrc(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof headerImage === "string" && headerImage.startsWith("http")) {
      setSrc(headerImage);
    }
  }, [headerImage]);

  const options = {
    year: "numeric",

    month: "long",

    day: "numeric",
  };

  const readableDate = blogDate
    ? new Date(blogDate).toLocaleDateString("en-US", options)
    : "Loading...";

  const now = new Date().toLocaleDateString("en-US", options);

  return (
    <main className="pt-12 px-2 w-[972px] flex flex-col space-y-12 mx-auto border-4 border-secondary-y bg-white min-h-screen">
      {/* Header */}

      <div className="flex flex-col gap-2 items-center">
        <h3 className="text-primary text-sm lg:text-[22px] text-center">
          {category === "perspectives"
            ? formatHead(category)
            : subcategory
              ? formatHead(subcategory)
              : "- Select Subcategory -"}
        </h3>

        <h1 className="text-center leading-relaxed font-medium sm:leading-normal sm:text-2xl xl:leading-normal text-lg lg:text-[40px]">
          {title || "Untitled Blog"}
        </h1>
      </div>

      {/* Author */}

      {category === "perspectives" && (
        <div className="flex justify-between items-center">
          <p>{blogId ? readableDate : now}</p>

          <div className="flex items-center gap-4">
            <span className="text-primary font-medium text-xs lg:text-base xl:text-lg">
              Written By
            </span>

            {author ? (
              <>
                <img
                  src={author.image}
                  alt={author.name}
                  className="object-cover size-12 rounded-full"
                />

                <p className="text-sm lg:text-lg">{author.name}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Please select an author</p>
            )}
          </div>
        </div>
      )}

      {/* Header Image */}

      <div className="w-full h-96 relative overflow-hidden rounded-xl">
        {src ? (
          <img src={src} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No Header Image
          </div>
        )}
      </div>

      {/* Blocks */}

      <section className="pb-12">
        {editors.length > 0 ? (
          editors.map((ele, ind) => (
            <div key={ind}>
              {renderBlock(ele.type, ele.load, ele.config, ele.visible)}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-12">
            No content blocks yet
          </div>
        )}
      </section>
    </main>
  );
}
