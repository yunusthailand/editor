import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditPanel from "./EditPanel";
import PreviewPanel from "./PreviewPanel";
import ErrorModal from "@/components/shared/ErrorModal";

const apiUrl = "https://backend-yth.onrender.com";

function toISOMidnightUTC(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString();
}

function reducer(state, action) {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      return [...state, action.payload];
    case "UPDATE":
      return state.map((editor, index) => {
        if (index !== action.index) return editor;
        let updatedEditor = { ...editor };
        switch (action.key) {
          case "expanded":
            updatedEditor.expanded = action.value;
            break;
          case "config":
            updatedEditor.config = { ...editor.config, ...action.value };
            break;
          case "visible":
            updatedEditor.visible = action.value;
            break;
          default:
            if (action.lang === "th") {
              updatedEditor.load_th = {
                ...(editor.load_th || editor.load),
                [action.key]: action.value,
              };
            } else {
              updatedEditor.load = {
                ...editor.load,
                [action.key]: action.value,
              };
            }
        }
        return updatedEditor;
      });
    case "REORDER":
      const targetInd = action.index;
      const finalInd = action.index + action.increment;
      const canSwitch = finalInd >= 0 && finalInd < state.length;
      if (!canSwitch) return state;
      const targetValue = {
        ...state[targetInd],
        config: { ...state[targetInd].config },
      };
      const finalValue = {
        ...state[finalInd],
        config: { ...state[finalInd].config },
      };
      return state.map((editor, index) => {
        if (index === targetInd) return finalValue;
        if (index === finalInd) return targetValue;
        return { ...editor, config: { ...editor.config } };
      });
    case "DELETE":
      return state.filter((_, index) => index !== action.index);
    default:
      return state;
  }
}

async function createFormData(metadata, content, categories, createdAt) {
  const formData = new FormData();
  formData.append(
    "metadata",
    JSON.stringify({
      title: metadata.title,
      title_th: metadata.title_th,
      selectedMember: metadata.selectedMember,
      headerPicture:
        metadata.headerPicture instanceof File
          ? "headerImage"
          : metadata.headerPicture,
    }),
  );
  formData.append(
    "createdAt",
    JSON.stringify({ iso: toISOMidnightUTC(createdAt) }),
  );
  const processedContent = content.map((block, index) => {
    if (block.type === "imageCaption" && block.load.img instanceof File) {
      const fileKey = `image-${index}`;
      formData.append(fileKey, block.load.img);
      return { ...block, load: { ...block.load, img: fileKey } };
    }
    return block;
  });
  formData.append("content", JSON.stringify(processedContent));
  if (metadata.headerPicture instanceof File)
    formData.append("headerImage", metadata.headerPicture);
  formData.append("categories", JSON.stringify(categories));
  return formData;
}

export default function BlogEditor() {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const [lang, setLang] = useState("en");
  const [createdAt, setCreatedAt] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [error, setError] = useState(null);
  const [editors, dispatch] = useReducer(reducer, []);
  const [title, setTitle] = useState("");
  const [title_th, setTitleTh] = useState("");
  const [headerImage, setHeaderImage] = useState();
  const [author, setAuthor] = useState();
  const [blogDate, setBlogDate] = useState();
  const [category, setCategory] = useState("perspectives");
  const [subcategory, setSubcategory] = useState("");

  useEffect(() => {
    if (!blogId) return;
    async function fetchBlogData() {
      try {
        const response = await fetch(`${apiUrl}/blog/${blogId}`);
        if (!response.ok) throw new Error("Failed to fetch blog");
        const blogData = await response.json();
        setBlogDate(blogData.created_at);
        setCreatedAt(new Date(blogData.created_at).toISOString().split("T")[0]);
        dispatch({ type: "SET", payload: blogData.content });
        setTitle(blogData.metadata.title);
        setTitleTh(blogData.metadata.title_th || "");
        setHeaderImage(blogData.metadata.headerPicture);
        setCategory(blogData.category || "");
        setSubcategory(blogData.subcategory || "");
        const authorId = blogData.author_id;
        if (!authorId) return;
        const authorResponse = await fetch(`${apiUrl}/team/${authorId}`);
        const authorData = await authorResponse.json();
        setAuthor(authorData[0]);
      } catch (err) {
        console.error(err);
      }
    }
    fetchBlogData();
  }, [blogId]);

  async function handleSaveBlog() {
    try {
      const formData = await createFormData(
        {
          title,
          title_th: title_th || title,
          headerPicture: headerImage,
          selectedMember: author?.id,
        },
        editors,
        { category, subcategory },
        createdAt,
      );
      const response = await fetch(`${apiUrl}/blog/${blogId || ""}`, {
        method: blogId ? "PUT" : "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Something went wrong");
      navigate("/blogs");
    } catch (error) {
      console.log(error);
      setError(error.message || "Error saving blog");
    }
  }

  return (
    <div className="min-h-screen flex">
      <EditPanel
        editors={editors}
        dispatch={dispatch}
        title={title}
        setTitle={setTitle}
        title_th={title_th}
        setTitleTh={setTitleTh}
        headerImage={headerImage}
        setHeaderImage={setHeaderImage}
        author={author}
        setAuthor={setAuthor}
        category={category}
        setCategory={setCategory}
        subcategory={subcategory}
        setSubcategory={setSubcategory}
        createdAt={createdAt}
        setCreatedAt={setCreatedAt}
        lang={lang}
      />
      <PreviewPanel
        blogId={blogId}
        editors={editors}
        title={lang === "th" ? title_th || title : title}
        headerImage={headerImage}
        author={author}
        blogDate={blogDate}
        category={category}
        subcategory={subcategory}
        lang={lang}
      />

      <div className="fixed bottom-8 z-20 w-full">
        <div className="flex justify-center bg-white max-w-96 mx-auto p-4 rounded-lg shadow-lg gap-4">
          <button
            onClick={() => setLang(lang === "en" ? "th" : "en")}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              lang === "th"
                ? "bg-secondary-t text-white"
                : "bg-white text-black border-gray-300"
            }`}
          >
            {lang === "en" ? "Switch to ภาษาไทย" : "Switch to English"}
          </button>
          <button
            className="bg-secondary-t p-3 text-2xl text-white rounded-xl"
            onClick={handleSaveBlog}
          >
            {blogId ? "Update" : "Create"}
          </button>
        </div>
      </div>

      <ErrorModal error={error} onClose={() => setError(null)} />
    </div>
  );
}
