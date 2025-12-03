import type { FarmPreviewType } from "@/store/user";
import { Select } from "antd";
import { useMemo } from "react";

export type FarmSelectType = {
  value: number;
  label: string;
};

interface Props {
  value: number;
  options: FarmPreviewType[];
  onChange: (newId: number) => void;
}
export default function FarmSelect(props: Props) {
  const farmOptions = useMemo(
    () => props.options.map((op) => ({ value: op.id, label: op.name })),
    [props.options],
  );
  return (
    <Select
      style={{ flexGrow: 1 }}
      defaultValue={props.value}
      options={farmOptions}
      onChange={(id: number) => {
        props.onChange(id);
      }}
    />
  );
}
