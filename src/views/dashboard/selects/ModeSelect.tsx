import { Select } from "antd";

type ModeType = "crop" | "farm";
export type ModeSelectType = {
  value: ModeType;
  label: string;
};

interface Props {
  value: ModeType;
  onChange: (newMode: ModeType) => void;
}
export default function ModeSelect(props: Props) {
  const options: ModeSelectType[] = [
    {
      value: "crop",
      label: "作物详情",
    },
    {
      value: "farm",
      label: "园区总览",
    },
  ];
  return (
    <Select
      style={{ flexGrow: 1 }}
      defaultValue={props.value}
      options={options}
      onChange={(mode) => {
        props.onChange(mode);
      }}
    />
  );
}
