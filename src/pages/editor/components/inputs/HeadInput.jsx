import { CONTROL } from "../EditorField";

export default function HeadInput({ id, value, onChange, placeholder }) {
  return (
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={CONTROL}
    />
  );
}
