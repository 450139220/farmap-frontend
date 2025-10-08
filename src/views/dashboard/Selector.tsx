import type { MapSelectors } from ".";
import style from "./index.module.css";

type SelectorTypes = keyof MapSelectors;
type SelectorProps<T extends string | number> = {
  selected: T;
  options: T[];
  type: SelectorTypes;
  onChange: (newValue: T, type: SelectorTypes) => void;
};
function Selector<T extends string | number>(props: SelectorProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChange(e.target.value as T, props.type);
  };
  return (
    <select
      className={style.selector}
      value={props.selected}
      onChange={handleChange}>
      {props.options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

export default Selector;
