export function chunkArray(array, size) {
  const result = [];

  for (let i = 0; i < array.length; i += size) {
    let chunk = array.slice(i, i + size);

    // If the last chunk is not full, pad it with null-value objects
    while (chunk.length < size) {
      const placeholder = Object.fromEntries(
        Object.keys(array[0]).map((key) => [key, null]),
      );
      chunk.push(placeholder);
    }

    result.push(chunk);
  }

  return result;
}

export function mapDatabaseImages(blog) {
  if (!blog.databaseImages) return blog; // If no images to map, return as is.

  const { databaseImages } = blog;

  // Map header image
  const updatedMetadata = {
    ...blog.metadata,
    headerPicture:
      databaseImages[blog.metadata.headerPicture] ||
      blog.metadata.headerPicture,
  };

  // Map content images
  const updatedContent = blog.content.map((block) => {
    if (block.type === "imageCaption" && databaseImages[block.load.img]) {
      return {
        ...block,
        load: {
          ...block.load,
          img: databaseImages[block.load.img], // Replace with actual image URL
        },
      };
    }
    return block;
  });

  return {
    ...blog,
    metadata: updatedMetadata,
    content: updatedContent,
  };
}

export function sortArrayByField(array, field, ascending = true) {
  if (!Array.isArray(array) || array.length === 0) {
    console.warn("Invalid or empty array");
    return [];
  }

  const sortedArray = [...array].sort((a, b) => {
    const valA = a[field];
    const valB = b[field];

    // Handle undefined/null values
    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;

    // Type checking
    const isDateA = valA instanceof Date || !isNaN(Date.parse(valA));
    const isDateB = valB instanceof Date || !isNaN(Date.parse(valB));

    if (typeof valA === "number" && typeof valB === "number") {
      return ascending ? valA - valB : valB - valA;
    }

    if (isDateA && isDateB) {
      const timeA = new Date(valA).getTime();
      const timeB = new Date(valB).getTime();
      return ascending ? timeA - timeB : timeB - timeA;
    }

    // Default to string comparison (alphabetical)
    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();

    if (strA < strB) return ascending ? -1 : 1;
    if (strA > strB) return ascending ? 1 : -1;
    return 0;
  });

  return sortedArray;
}

export function formatReadableDate(
  dateString,
  options = { year: "numeric", month: "long", day: "numeric" },
) {
  if (!dateString) return "loading";

  const date = new Date(dateString);

  if (isNaN(date)) return "Invalid date";

  return date.toLocaleDateString("en-US", options);
}

export function replaceHyphensWithSpaces(str) {
  return str.replace(/-/g, " ");
}

export function proper(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatHead(str) {
  if (!str) return "";
  // Press Release
  let result = proper(replaceHyphensWithSpaces(str));
  if (result === "Press Release") {
    result = "Press Release & News";
  } else {
    result = addS(result);
  }

  return result;
}

export function formatHeadLite(str) {
  if (!str) return "";
  return proper(replaceHyphensWithSpaces(str));
}
export function getTeamColors(team) {
  switch (team?.toLowerCase()) {
    case "ventures":
      return "bg-secondary-p";
    case "advisors":
      return "bg-primary";
    case "operations":
      return "bg-secondary-t";
    case "leaderships":
      return "bg-secondary-y";
    case "programs":
      return "bg-secondary-r";
    default:
      return "bg-secondary-p";
  }
}

export function getTeamTextColors(team) {
  switch (team?.toLowerCase()) {
    case "ventures":
      return "text-secondary-p";
    case "advisors":
      return "text-primary";
    case "operations":
      return "text-secondary-t";
    case "leaderships":
      return "text-secondary-y";
    case "programs":
      return "text-secondary-r";
    default:
      break;
  }
}

export function getBlogTextColors(team) {
  switch (team?.toLowerCase()) {
    case "press-release":
      return "text-secondary-p";
    case "press-releases":
      return "text-secondary-p";
    case "case-studies":
      return "text-primary";
    case "toolkit":
      return "text-secondary-r";
    case "toolkits":
      return "text-secondary-r";
    case "videos":
      return "text-secondary-y";
    case "publication":
      return "text-secondary-t";
    case "publications":
      return "text-secondary-t";
    default:
      return "text-primary";
  }
}

export function getBlogColors(category) {
  switch (category?.toLowerCase()) {
    case "press-release":
      return "bg-secondary-p";
    case "press-releases":
      return "bg-secondary-p";
    case "case-studies":
      return "bg-primary";
    case "toolkit":
      return "bg-secondary-r";
    case "toolkits":
      return "bg-secondary-r";
    case "videos":
      return "bg-secondary-y";
    case "publication":
      return "bg-secondary-t";
    case "publications":
      return "bg-secondary-t";
    default:
      return "bg-primary";
  }
}

export function parseMarkdownLinks(text) {
  const elements = [];
  let lastIndex = 0;

  while (true) {
    let openBracket = text.indexOf("[", lastIndex);
    let closeBracket = text.indexOf("]", openBracket);
    let openParen = text.indexOf("(", closeBracket);
    let closeParen = text.indexOf(")", openParen);

    if (
      openBracket === -1 ||
      closeBracket === -1 ||
      openParen === -1 ||
      closeParen === -1
    ) {
      elements.push(text.slice(lastIndex));
      break;
    }

    elements.push(text.slice(lastIndex, openBracket));
    let linkText = text.slice(openBracket + 1, closeBracket);
    let url = text.slice(openParen + 1, closeParen);
    if (!url.startsWith("http")) url = `https://${url}`;

    elements.push(
      <a
        className="text-blue-500 underline hover:text-blue-700"
        key={lastIndex}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {linkText}
      </a>,
    );
    lastIndex = closeParen + 1;
  }

  return elements;
}
export function parseSingleMarkdownLink(text, key) {
  const linkRegex = /^\[(.*?)\]\((.*?)\)$/; // matches [text](url) ONLY if entire string is a link

  const match = text.match(linkRegex);

  if (match) {
    let linkText = match[1];
    let url = match[2];
    if (!url.startsWith("http")) url = `https://${url}`;

    return (
      <a
        key={key}
        className="text-blue-500 underline hover:text-blue-700"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {linkText}
      </a>
    );
  }

  // If it doesn't match, return the text as-is
  return <span key={key}>{text}</span>;
}

function addS(str) {
  if (str.endsWith("s")) {
    return str;
  } else {
    return str + "s";
  }
}
