import { Select } from "antd";

type InfoType = "yield" | "size" | "disease";
export type InfoSelectType = {
  value: InfoType;
  label: string;
};

interface Props {
  value: InfoType;
  disabled: boolean;
  onChange: (newInfo: InfoType) => void;
}
export default function InfoSelect(props: Props) {
  const options: InfoSelectType[] = [
    {
      value: "yield",
      label: "产量分布",
    },
    {
      value: "disease",
      label: "病虫分布",
    },
    {
      value: "size",
      label: "冠层分布",
    },
  ];
  return (
    <Select
      style={{ flexGrow: 1 }}
      defaultValue={props.value}
      disabled={props.disabled}
      options={options}
      onChange={(info) => {
        props.onChange(info);
      }}
    />
  );
}
