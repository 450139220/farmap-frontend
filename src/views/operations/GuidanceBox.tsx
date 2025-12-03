import type { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { Card, Flex } from "antd";

export interface Guidance {
  id: number;
  text: string;
  isFormula: boolean;
}
interface Props {
  list: Guidance[];
  type: string;
  iconClass: React.FC<AntdIconProps>;
}
export default function GuidanceBox(props: Props) {
  return (
    <Flex style={{ flex: "0 0 calc(50% - 0.5rem)" }}>
      <Card
        title={
          <>
            <props.iconClass />
            &nbsp;&nbsp;{props.type}
          </>
        }
        style={{ flexGrow: 1 }}>
        <div>
          {props.list
            .filter((l) => !l.isFormula)
            .map((l) => (
              <div key={l.id}>
                <span>操作建议</span>
                {l.text}
              </div>
            ))}
          {props.list
            .filter((l) => l.isFormula)
            .map((l) => (
              <div key={l.id}>
                <span>配方推荐</span>
                {l.text}
              </div>
            ))}
        </div>
      </Card>
    </Flex>
  );
}
