import { Flex, Select } from "antd";

type ModeType = "crop" | "farm" | "monitor";
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
    {
      value: "monitor",
      label: "监控预览",
    },
  ];
  return (
    <Flex gap="0.5rem" align="center" style={{ flexGrow: 1 }}>
      <span> | 地图模式</span>
      <Select
        style={{ flexGrow: 1 }}
        defaultValue={props.value}
        options={options}
        onChange={(mode) => {
          props.onChange(mode);
        }}
      />
    </Flex>
  );
}
