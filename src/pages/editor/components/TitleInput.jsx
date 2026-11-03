import { useId } from "react";
import { CONTROL, Field, LangBadge } from "./EditorField";

export default function TitleInput({
  title,
  setTitle,
  title_th,
  setTitleTh,
  lang,
}) {
  const id = useId();
  const isThai = lang === "th";

  return (
    <Field
      label="Blog title"
      htmlFor={id}
      badge={isThai && <LangBadge />}
      hint={isThai ? "Leave empty to use the English title." : undefined}
    >
      <input
        id={id}
        type="text"
        value={isThai ? title_th : title}
        onChange={(e) => (isThai ? setTitleTh : setTitle)(e.target.value)}
        placeholder={
          isThai ? "ชื่อบล็อกภาษาไทย..." : "Enter your blog title..."
        }
        className={CONTROL}
      />
    </Field>
  );
}
