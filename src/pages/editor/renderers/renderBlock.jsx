import Combo from "../blocks/Combo";
import Heading from "../blocks/Heading";
import ImageCaption from "../blocks/ImageCaption";
import List from "../blocks/List";
import Paragraph from "../blocks/Paragraph";
import Spacer from "../blocks/Spacer";
import VideoEmbed from "../blocks/VideoEmbed";

export default function renderBlock(
  type,
  load,
  config,
  visible,
  load_th,
  lang,
) {
  if (!visible) return null;

  const activeLoad = lang === "th" ? load_th || load : load;

  switch (type) {
    case "heading":
      return <Heading load={activeLoad} config={config} />;
    case "combo":
      return <Combo load={activeLoad} config={config} />;
    case "imageCaption":
      return <ImageCaption load={activeLoad} config={config} />;
    case "paragraph":
      return <Paragraph load={activeLoad} config={config} />;
    case "spacer":
      return <Spacer config={config} />;
    case "list":
      return <List load={activeLoad} config={config} />;
    case "videoEmbed":
      return <VideoEmbed load={activeLoad} config={config} />;
    default:
      return (
        <div className="border border-red-400 bg-red-50 text-red-600 p-4 rounded">
          Unknown block type: {type}
        </div>
      );
  }
}
