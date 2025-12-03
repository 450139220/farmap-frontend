import { Flex, Select } from "antd";

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
      label: "作物产量",
    },
    {
      value: "disease",
      label: "病虫害率",
    },
    {
      value: "size",
      label: "冠层大小",
    },
  ];
  return (
    <Flex gap="0.5rem" align="center" style={{ flexGrow: 1 }}>
      <span> | 展示信息</span>
      <Select
        style={{ flexGrow: 1 }}
        defaultValue={props.value}
        disabled={props.disabled}
        options={options}
        onChange={(info) => {
          props.onChange(info);
        }}
      />
    </Flex>
  );
}
